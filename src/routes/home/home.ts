import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

import AudioModel from "../../database/models/AudioModel";

const router = Router();

router.get(
    "/",
    asyncHandler(async (_req: Request, res: Response) => {
        const docs = await AudioModel.find().sort({ uploadAt: -1 }).lean();
        res.json({ ok: true, response: docs });
    })
);
export default router;
