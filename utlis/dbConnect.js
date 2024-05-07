// dbConnect.js
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI; // Replace with your MongoDB connection string

let cachedClient = null;

export async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}
