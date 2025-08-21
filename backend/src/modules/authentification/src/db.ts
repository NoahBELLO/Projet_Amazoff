import { MongoClient, ServerApiVersion, Collection, Db } from 'mongodb';
import {TokenModel} from './tokenModel';

const uri: string = process.env.MONGO_URI as string;

const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
export async function db() {
    await client.connect();
    const database: Db = client.db(process.env.BASE_DE_DONNEE);

    TokenModel.collection = database.collection(process.env.COLLECTION as string);
}
