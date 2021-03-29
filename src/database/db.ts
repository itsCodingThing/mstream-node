import { GridFSBucket } from "mongodb";
import { mongoose } from "@typegoose/typegoose";

const localDb =
    process.env.DB_URI ??
    "mongodb+srv://mstream:mstream123@cluster0.yqnka.gcp.mongodb.net/mstream?retryWrites=true&w=majority";

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
