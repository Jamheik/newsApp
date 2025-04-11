import OpenAI from 'openai';
import * as Sentry from '@sentry/node';
import { Db, ObjectId } from 'mongodb';
import { Article, ArticleContext } from '../types';

interface RegenerateResponse {
    title: string;
    smallTitle: string;
    content: string;
    language: string;
}

async function callRegenerationAPI(currentContent: string): Promise<RegenerateResponse> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
        /* your logic to determine the language code */
        const providedLanguageCode = 'fi';

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: "system",
                    content: `You are an experienced content editor. The provided article has a clickbait title and content designed to keep the reader engaged. Your tasks are:
1. Generate content in the article's language by default, unless a specific language code (ISO 3166-1 alpha-2) is provided.
2. Create a revised title that is clear, informative, and free from clickbait.
3. Create a secondary title (smallTitle) that is clear and does not exceed 60 characters.
4. Rewrite the article content to be more straightforward, readable, and engaging, avoiding clickbait tactics.

Output your answer as a JSON object in this format:
{
  "language": "[Language code]",
  "title": "[Revised title]",
  "smallTitle": "[Revised title, max 60 characters]",
  "content": "[Rewritten article content]"
}
${providedLanguageCode ? `Please generate the content in ${providedLanguageCode}.` : ''}
          `
                },
                {
                    role: "user",
                    content: currentContent
                }
            ],
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0].message.content;
        if (!response) {
            throw new Error('No response from OpenAI API');
        }
        const data: RegenerateResponse = JSON.parse(response);

        return data;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error('Error calling regeneration API: ' + error);
    }
}

/**
 * Regenerates an article's title and full content.
 * 1. Retrieves the article by its ID and determines its current full content.
 * 2. Checks if a regenerated version already exists (version > 1).
 * 3. Calls OpenAI to generate a new title, small title, and content.
 * 4. Inserts the new version (with version incremented by one) into the article_contexts collection.
 */
export async function regenerateArticleContent(db: Db, articleId: string): Promise<void> {
    try {
        const articlesCollection = db.collection<Article>('articles');
        const contextsCollection = db.collection<ArticleContext>('article_contexts');

        const article = await articlesCollection.findOne({ _id: new ObjectId(articleId) });
        if (!article) {
            throw new Error('Article not found');
        }

        const currentContext = await contextsCollection.find({ article_id: article._id })
            .sort({ version: -1 })
            .limit(1)
            .next();


        if (currentContext && currentContext.version > 1) {
            return;
        }

        if (!currentContext || !currentContext.full_text) {
            throw new Error('No content available for regeneration');
        }

        const currentContent = currentContext.full_text;

        // Call OpenAI to regenerate title and content using the new prompt.
        const regenerated = await callRegenerationAPI(currentContent);

        const newVersion = currentContext ? currentContext.version + 1 : 1;

        const newContext: ArticleContext = {
            article_id: article._id as ObjectId,
            language_code: regenerated.language, // You can adjust or derive this from the response if needed.
            title: regenerated.title,
            full_text: regenerated.content,
            version: newVersion,
            created_at: new Date()
        };
        await contextsCollection.insertOne(newContext);

        console.log(`Regenerated content for article ${articleId} with new title: ${regenerated.title}`);
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error regenerating article content:', error);
        throw error;
    }
}
