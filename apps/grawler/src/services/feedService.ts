import RSSParser from 'rss-parser';
import * as Sentry from '@sentry/node';
import { ObjectId, Db, Collection } from 'mongodb';
import { Feed, Article } from '../types';
import { uploadImageToS3 } from './s3Service';
import pLimit from 'p-limit';

const IltaSanomatRegex = /art-(\d+)\.html/;
const YleRegex = /\/a\/(\d+-\d+)/;


export class FeedService {
    private db: Db;
    private parser: RSSParser;
    private feedsCollection: Collection<Feed>;
    private articlesCollection: Collection<Article>;
    private s3ImageCache: Map<string, string>; // Cache for S3 image URLs
    private concurrencyLimit: number;



    constructor(db: Db, parser?: RSSParser, concurrencyLimit = 5) {
        this.db = db;
        this.parser = parser || new RSSParser();
        this.feedsCollection = db.collection<Feed>('feeds');
        this.articlesCollection = db.collection<Article>('articles');
        this.s3ImageCache = new Map<string, string>();
        this.concurrencyLimit = concurrencyLimit;
    }


    public static extractUniqueId(link: string): string | null {
        let match = IltaSanomatRegex.exec(link);
        if (match && match[1]) {
            return match[1];
        }
        match = YleRegex.exec(link);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }


    public async fetchAndStoreFeed(feedUrl: string): Promise<void> {
        try {
            const feed = await this.getOrCreateFeed(feedUrl);
            const feedData = await this.parser.parseURL(feedUrl);

            const validItems = feedData.items.filter(item => item.link && item.title);

            const links = validItems.map(item => item.link!);
            const existingArticles = await this.articlesCollection
                .find({ link: { $in: links } })
                .toArray();
            const existingLinks = new Set(existingArticles.map(article => article.link));

            const newItems = validItems.filter(item => !existingLinks.has(item.link!));

            if (newItems.length === 0) {
                console.log('No new articles found.');
                return;
            }

            const limit = pLimit(this.concurrencyLimit);
            const articlePromises = newItems.map(item =>
                limit(() => this.processFeedItem(feed, item))
            );
            const articlesResults = await Promise.all(articlePromises);

            const articlesToInsert = articlesResults.filter(
                (article): article is Article => article !== null
            );

            if (articlesToInsert.length > 0) {
                await this.articlesCollection.insertMany(articlesToInsert);
                console.log(`Inserted ${articlesToInsert.length} new articles.`);
            } else {
                console.log('No articles to insert after processing.');
            }
        } catch (error) {
            Sentry.captureException(error);
            console.error('Error in fetchAndStoreFeed:', error);
        }
    }

    private async getOrCreateFeed(feedUrl: string): Promise<Feed> {
        let feed = await this.feedsCollection.findOne({ feed_url: feedUrl });
        if (!feed) {
            const result = await this.feedsCollection.insertOne({ feed_url: feedUrl });
            feed = { _id: result.insertedId, feed_url: feedUrl };
        }
        return feed;
    }


    private async processFeedItem(feed: Feed, item: RSSParser.Item): Promise<Article | null> {
        try {
            const title: string = item.title!;
            const link: string = item.link!;
            const uniqueId = FeedService.extractUniqueId(link);
            if (!uniqueId) {
                console.error(`No unique ID found for article: ${title}`);
                return null;
            }

            let imageS3Url: string | (null | undefined) = null;
            if (item.enclosure && item.enclosure.url) {
                const imageUrl = item.enclosure.url;
                if (this.s3ImageCache.has(imageUrl)) {
                    imageS3Url = this.s3ImageCache.get(imageUrl)!;
                } else {
                    try {
                        imageS3Url = await uploadImageToS3(imageUrl);

                        this.s3ImageCache.set(imageUrl, imageS3Url || '');
                    } catch (uploadError) {
                        Sentry.captureException(uploadError);
                        console.error(`Error uploading image for article: ${title}, URL: ${imageUrl}`, uploadError);
                        imageS3Url = null;
                    }
                }
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

            return article;
        } catch (error) {
            Sentry.captureException(error);
            console.error(`Error processing feed item with link ${item.link}:`, error);
            return null;
        }
    }
}
