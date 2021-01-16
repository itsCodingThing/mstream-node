import { NextFunction, Request, Response, Router } from "express";
import AudioModel from "../../database/models/AudioModel";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const docs = await AudioModel.find().lean();
        res.json({ ok: true, response: docs });
    } catch (error) {
        next(error);
    }
});
export default router;
