import { GridFSBucket } from "mongodb";
import mongoose, { Connection } from "mongoose";

const localDb = process.env.DB_URI;

interface Cached {
  connection?: Connection;
  gfs?: GridFSBucket;
  isCached: boolean;
}

const cachedConnection: Cached = { isCached: false };

export async function connectToDb(): Promise<Cached> {
  if (!cachedConnection.isCached) {
    try {
      const connection = await mongoose.createConnection(localDb, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });

      const gfs = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: "songs",
      });

      return { connection, gfs, isCached: true };
    } catch (error) {
      console.log(error);
    }
  } else {
    return cachedConnection;
  }
}
