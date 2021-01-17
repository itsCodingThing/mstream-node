import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { promisifyPipeline } from "../../utils/util";

import { gridfs } from "../../server";

const router = Router();

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const audioBlobID = req.params.id;
        const id = mongoose.Types.ObjectId(audioBlobID);
        const downloadStream = gridfs.openDownloadStream(id);

        await promisifyPipeline(downloadStream, res);
        console.log("stream complete");
    } catch (error) {
        next(error);
    }
});

export default router;
