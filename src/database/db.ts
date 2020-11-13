import { GridFSBucket } from "mongodb";
import mongoose, { Connection } from "mongoose";

const localDb = process.env.DB_URI;

interface Cached {
  connection?: Connection;
  gfs?: GridFSBucket;
  cache: boolean;
}

const cachedConnection: Cached = { cache: false };

export async function connectToDb(): Promise<Cached> {
  if (!cachedConnection.cache) {
    const connection = await mongoose.createConnection(localDb, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    const gfs = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: "songs",
    });

    return { connection, gfs, cache: true };
  } else {
    return cachedConnection;
  }
}
