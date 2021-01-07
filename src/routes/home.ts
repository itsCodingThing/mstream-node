import { Request, Response, Router } from "express";
import { gridfs } from "../server";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const docs = await gridfs.find().toArray();

        res.json({ ok: true, response: docs });
    } catch (error) {
        res.json({ ok: false, error: "something went wrong with the backend" });
    }
});

router.post("/upload/:songName", async (req: Request, res: Response) => {
    try {
        const name = req.params.songName;
        const uploadStream = gridfs.openUploadStream(name);
        req.pipe(uploadStream);

        uploadStream.on("finish", () => {
            res.json({ ok: true, songId: uploadStream.id });
        });

        uploadStream.on("error", () => {
            res.json({ ok: false, error: "something went wrong with the database" });
        });
    } catch (error) {
        res.json({ ok: false, error: "something went wrong with the backend" });
    }
});

export default router;
