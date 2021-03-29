import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { promisifyPipeline } from "../../utils/util";
import { gridfs } from "../../server";

const router = Router();

router.get(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const audioBlobID = req.params.id;
        const id = mongoose.Types.ObjectId(audioBlobID);
        const downloadStream = gridfs.openDownloadStream(id);

        await promisifyPipeline(downloadStream, res);
        console.log("stream complete");
    })
);

export default router;
