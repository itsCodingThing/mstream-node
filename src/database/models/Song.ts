import mongoose, { Document } from "mongoose";
const { model, Schema } = mongoose;

interface ISong extends Document {
    title: string;
    artist: string;
    year: string;
    album: string;
    image?: Buffer;
    filename: string;
    songBlobID: string;
    uploadAt: Date;
}

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        default: "unknown",
    },
    year: {
        type: String,
        default: "unknown",
    },
    album: {
        type: String,
        default: "unknown",
    },
    image: {
        type: Buffer,
    },
    filename: {
        type: String,
    },
    songBlobID: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: new Date(),
    },
});

export const Song = model<ISong>("Song", SongSchema);
