import { MongoClient, Db } from 'mongodb';

let dbInstance: Db;

export async function connectToDb(): Promise<Db> {
    if (dbInstance) return dbInstance;

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb';

    console.log('Started creating to MongoDB connection');

    const client = new MongoClient(mongoUri);
    await client.connect();
    dbInstance = client.db(process.env.MONGODB_DB || 'mydb');
    console.log('Connected to MongoDB');
    return dbInstance;
}
