import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

// eslint-disable-next-line prettier/prettier
const localDb = process.env.DB_URI;

export async function connectToDb(): Promise<GridFSBucket> {
    try {
        const connection = await mongoose.createConnection(localDb, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        return new mongoose.mongo.GridFSBucket(connection.db, {
            bucketName: "songs",
        });
    } catch (error) {
        console.log(error);
    }
}
