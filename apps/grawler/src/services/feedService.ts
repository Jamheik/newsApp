import RSSParser from 'rss-parser';
import * as Sentry from '@sentry/node';
import { ObjectId, Db } from 'mongodb';
import { Feed, Article } from '../types';
import { uploadImageToS3 } from './s3Service';

const parser = new RSSParser();

function extractUniqueId(link: string): string | null {
    const regex = /art-(\d+)\.html/;
    const match = regex.exec(link);
    return match && match[1] ? match[1] : null;
}

export async function fetchAndStoreFeed(db: Db, feedUrl: string): Promise<void> {
    try {
        const feedsCollection = (db as Db).collection<Feed>('feeds');
        let feed = await feedsCollection.findOne({ feed_url: feedUrl });
        if (!feed) {
            const result = await feedsCollection.insertOne({ feed_url: feedUrl });
            feed = { _id: result.insertedId, feed_url: feedUrl };
        }
        const articlesCollection = (db as Db).collection<Article>('articles');
        const feedData = await parser.parseURL(feedUrl);
        for (const item of feedData.items) {
            if (!item.link || !item.title) continue;

            const title: string = item.title;
            const link: string = item.link;
            const exists = await articlesCollection.findOne({ link });
            if (exists) continue;

            let uniqueId = item.guid;
            if (!uniqueId) {
                const extractedId = extractUniqueId(link);
                if (!extractedId) {
                    console.error(`No unique ID found for article: ${title}`);
                    continue;
                }
                uniqueId = extractedId;
            }

            let imageS3Url: string | null | undefined = null;
            if (item.enclosure && item.enclosure.url) {
                imageS3Url = await uploadImageToS3(item.enclosure.url);
            }

            const categories: string[] = item.categories || [];

            const article: Article = {
                feed_id: feed._id as ObjectId,
                unique_id: uniqueId,
                link,
                pub_date: item.pubDate,
                iso_date: item.isoDate,
                image: imageS3Url,
                categories
            };
            await articlesCollection.insertOne(article);
            console.log(`Inserted article: ${title} (uniqueId: ${uniqueId})`);
        }
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error in fetchAndStoreFeed:', error);
    }
}
