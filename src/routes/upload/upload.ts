import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";

import { Song } from "../../database/models/Song";
import { gridfs, tempDir } from "../../server";
import { id3Tag, promisifyPipeline } from "../../utils/util";

const router = Router();

router.post("/:songName", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.songName;
        const uploadStream = gridfs.openUploadStream(name);

        // Start uploading song in the database with a name
        await promisifyPipeline(req, uploadStream);
        console.log("successfully uploaded to database");

        const id = uploadStream.id.toString();
        const objID = mongoose.Types.ObjectId(id);
        const cachedFilename = `${id}.mp3`;

        // Store the song in temp directory for reading tag
        await promisifyPipeline(gridfs.openDownloadStream(objID), tempDir.saveFileInTempDirStream(cachedFilename));
        console.log("successfully downloaded from database and saved locally");

        const dataBuffer = tempDir.readFileFromTempDir(cachedFilename);
        const { title = name, album, artist, year, image } = await id3Tag.read(dataBuffer);

        let imageBuffer: Buffer;
        if (typeof image === "object") {
            imageBuffer = image.imageBuffer;
        }

        const song = new Song({ title, album, artist, year, image: imageBuffer, songBlobID: id });

        // Save song details in the database
        const result = await song.save();
        console.log(result.toJSON());
        console.log("successfully saved the song details in database");

        // Send a response with a song id of current saved data
        res.json({ ok: true, songId: song.id });
    } catch (error) {
        next(error);
    }
});

export default router;
