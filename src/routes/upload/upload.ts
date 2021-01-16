import { NextFunction, Request, Response, Router } from "express";

import AudioModel from "../../database/models/AudioModel";
import { gridfs } from "../../server";
import { promisifyPipeline } from "../../utils/util";

const router = Router();

router.post("/:title", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.title;
        const uploadStream = gridfs.openUploadStream(name);

        // Start uploading song in the database with a name
        await promisifyPipeline(req, uploadStream);
        console.log("successfully uploaded to database");

        // Upload song info in db
        const newAudio = new AudioModel({ title: name, audioBlobID: uploadStream.id });

        await newAudio.save();
        res.json({ ok: true, response: { audioBlobID: newAudio.id } });
    } catch (error) {
        next(error);
    }
});

export default router;
