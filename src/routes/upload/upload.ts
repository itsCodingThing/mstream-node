import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

import AudioModel from "../../database/models/AudioModel";
import { gridfs } from "../../server";
import { promisifyPipeline } from "../../utils/util";

const router = Router();

router.post(
    "/:title",
    asyncHandler(async (req: Request, res: Response) => {
        const { title } = req.params;
        const uploadStream = gridfs.openUploadStream(title);

        // Start uploading song in the database with a name
        await promisifyPipeline(req, uploadStream);
        console.log("successfully uploaded to database");

        // Upload song info in db
        const audio = new AudioModel({ title: title, audioBlobID: uploadStream.id });

        await audio.save();
        res.json({ ok: true, response: { audioBlobID: audio.id } });
    })
);

export default router;
