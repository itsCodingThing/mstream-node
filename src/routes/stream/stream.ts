import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { tempDir, gridfs } from "../../server";

const router = Router();

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const songID = req.params.id;
        const id = mongoose.Types.ObjectId(songID);
        const downloadStream = gridfs.openDownloadStream(id);
        const cachedFilename = `${id}.mp3`;

        if (tempDir.getFileList.includes(cachedFilename)) {
            const data = tempDir.readFileFromTempDir(cachedFilename);

            return res.send(data);
        } else {
            const writeFile = tempDir.saveFileInTempDirStream(cachedFilename);

            downloadStream.pipe(writeFile);

            downloadStream.on("end", () => {
                res.send(tempDir.readFileFromTempDir(cachedFilename));
            });

            downloadStream.on("error", (err) => {
                next(err);
            });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
