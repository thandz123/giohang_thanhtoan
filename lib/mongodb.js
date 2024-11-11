import { MongoClient } from "mongodb";

let client;
let clientPromise;

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to persist the client
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each request
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
