import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ options: { customName: "Audio" } })
class AudioSchemaClass {
    @prop({ required: true })
    title!: string;

    @prop({ default: "unknown" })
    filename!: string;

    @prop({ required: true })
    audioBlobID!: string;

    @prop({ default: Date.now })
    uploadAt!: Date;
}

const AudioModel = getModelForClass(AudioSchemaClass);

export default AudioModel;
