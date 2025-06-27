import { MongoClient, Db } from 'mongodb';

   let db: Db;

   export async function connectMongo(): Promise<Db> {
     if (db) return db;

     const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/datavault';
     const client = new MongoClient(uri);

     try {
       await client.connect();
       db = client.db('datavault');
       console.log('Connected to MongoDB');
       return db;
     } catch (error: any) {
       console.error('MongoDB connection error:', error.message);
       throw error;
     }
   }