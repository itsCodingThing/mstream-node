import { Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";

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
class AudioInput {
    @Field({ description: "title of the audio file" })
    title!: string;

    @Field({ description: "id of audio file saved in db" })
    audioBlobID!: string;
}

@Resolver(Audio)
class AudioResolver {
    @Query(() => [Audio])
    async songsList() {
        const list = await AudioModel.find().lean();
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

    @Mutation(() => Audio)
    async addAudio(@Args() { title, audioBlobID }: AudioInput) {
        const newAudio = new AudioModel({ title, audioBlobID });
        await newAudio.save();
        console.log(newAudio.toObject());

        return {
            id: newAudio.id,
            title: newAudio.title,
            filename: newAudio.filename,
            uploadAt: newAudio.uploadAt,
            audioBlobID: newAudio.audioBlobID,
        };
    }
}

export default AudioResolver;
