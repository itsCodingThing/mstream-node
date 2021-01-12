import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

const localDb = process.env.DB_URI;

export async function connectToDb(): Promise<GridFSBucket> {
    const connection = await mongoose.createConnection(localDb, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    await mongoose.connect(localDb, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    return new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: "bin",
    });
}
