import { gridfs } from "../server";
import { Arg, Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { mongoose } from "@typegoose/typegoose";

import AudioModel from "../database/models/AudioModel";

@ObjectType()
class Audio {
    @Field({ description: "id of the audio file info" })
    id!: string;

    @Field({ description: "title of the audio file" })
    title!: string;

    @Field({ description: "fileanme of the audio file" })
    filename!: string;

    @Field({ description: "id of audio blob file saved in db" })
    audioBlobID!: string;

    @Field({ description: "upload time of audio file" })
    uploadAt!: string;
}

@ArgsType()
class AddAudioInput {
    @Field({ description: "title of the audio file" })
    title!: string;

    @Field({ description: "id of audio file saved in db" })
    audioBlobID!: string;
}

@ArgsType()
class RemoveAudioInput {
    @Field({ description: "audio id" })
    id!: string;

    @Field({ description: "audio blob id" })
    audioBlobID!: string;
}

@Resolver(Audio)
class AudioResolver {
    @Query(() => [Audio])
    async songsList() {
        // get all the docs in descending order of date (latest --> old)
        const list = await AudioModel.find().sort({ uploadAt: -1 }).lean();

        // crateing new list wiith id property in each doc
        const newList = list.map((doc) => {
            const { _id, title, filename, audioBlobID, uploadAt } = doc;
            return {
                title,
                filename,
                audioBlobID,
                uploadAt,
                id: _id,
            };
        });

        return newList;
    }

    @Query(() => Audio)
    async getAudioById(@Arg("id") id: string) {
        const audio = await AudioModel.findById(id).lean();

        return {
            id: audio?._id,
            title: audio?.title,
            fileanme: audio?.filename,
            uploadAt: audio?.uploadAt,
            audioBlobID: audio?.audioBlobID,
        };
    }

    @Mutation(() => Audio)
    async addAudio(@Args() { title, audioBlobID }: AddAudioInput) {
        const newAudio = new AudioModel({ title, audioBlobID });
        await newAudio.save();

        return {
            id: newAudio.id,
            title: newAudio.title,
            filename: newAudio.filename,
            uploadAt: newAudio.uploadAt,
            audioBlobID: newAudio.audioBlobID,
        };
    }

    @Mutation(() => Audio)
    async removeAudio(@Args() { id, audioBlobID }: RemoveAudioInput) {
        // first find the related audio info in db and delete it
        // then deleting audio blob from db
        // if any of these promise failed or reject
        // then complete promise will reject
        const [removeAudio] = await Promise.all([
            AudioModel.findByIdAndDelete(id).lean(),
            gridfs.delete(mongoose.Types.ObjectId(audioBlobID)),
        ]);

        // Return deleted audio info
        return {
            id: removeAudio?._id,
            title: removeAudio?.title,
            fileanme: removeAudio?.filename,
            uploadAt: removeAudio?.uploadAt,
            audioBlobID: removeAudio?.audioBlobID,
        };
    }
}

export default AudioResolver;
