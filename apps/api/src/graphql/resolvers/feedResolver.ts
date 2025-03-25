import { Db, Collection } from 'mongodb';
import { Feed } from '../../types';

export const Resolver = async (_: any, __: any, { db }: { db: Db }) => {
    const feedsCollection: Collection<Feed> = db.collection('feeds');
    const feeds = await feedsCollection.find().toArray();
    return feeds.map(feed => ({
        id: feed._id?.toHexString(),
        feed_url: feed.feed_url,
        feed_name: feed.feed_name
    }));
}  