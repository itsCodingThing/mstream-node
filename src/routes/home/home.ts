import { NextFunction, Request, Response, Router } from "express";

import { gridfs } from "../../server";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const docs = await gridfs.find().toArray();

        res.json({ ok: true, response: docs });
    } catch (error) {
        next(error);
    }
});
export default router;
