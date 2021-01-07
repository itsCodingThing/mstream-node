import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { tempDir, gridfs } from "../server";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const songID = req.params.id;
        const id = mongoose.Types.ObjectId(songID);
        const downloadStream = gridfs.openDownloadStream(id);

        if (tempDir.getFileList.includes(`${id}.mp3`)) {
            return res.send(tempDir.readFileFromTempDir(`${id}.mp3`));
        } else {
            const writeFile = tempDir.saveFileInTempDir(`${id}.mp3`);

            downloadStream.pipe(writeFile);

            downloadStream.on("end", () => {
                res.send(tempDir.readFileFromTempDir(`${id}.mp3`));
            });

            downloadStream.on("error", (err) => {
                res.json({ ok: false, error: err.message });
            });
        }
    } catch (error) {
        console.log(error);

        res.json({ ok: false, error: "something went wrong with backend" });
    }
});

export default router;
