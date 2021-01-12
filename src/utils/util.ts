import NodeID3 from "node-id3";
import { pipeline } from "stream";
import { promisify } from "util";

export const promisifyPipeline = promisify(pipeline);
export const id3Tag = NodeID3.Promise;
