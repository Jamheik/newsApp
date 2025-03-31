import { connectToDb } from '../../db/mongo';
import { Collection } from 'mongodb';
import { Article } from '../../types';

export const Resolver = async (): Promise<string[]> => {
    const db = await connectToDb();
    const articlesCollection: Collection<Article> = db.collection('articles');

    const uniqueCategories = await articlesCollection.distinct('categories');
    return uniqueCategories;
};