import express, { Request, Response } from "express";
import { connectToDb } from "../database/db";
import mongoose from "mongoose";
import { createWriteStream, readFileSync } from "fs";
import { join } from "path";
import { tempDir } from "../server";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { gfs } = await connectToDb();
    const docs = await gfs.find().toArray();

    res.json({ ok: true, response: docs });
  } catch (error) {
    res.json({ ok: false, error: "something went wrong with the backend" });
  }
});

router.post("/upload/:songName", async (req: Request, res: Response) => {
  try {
    const { gfs } = await connectToDb();
    const name = req.params.songName;
    const uploadStream = gfs.openUploadStream(name);
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

router.get("/stream/:id", async (req: Request, res: Response) => {
  try {
    const { gfs } = await connectToDb();

    const songID = req.params.id;
    const id = mongoose.Types.ObjectId(songID);
    const downloadStream = gfs.openDownloadStream(id);

    const writeFile = createWriteStream(join(tempDir, `${id}.mp3`));

    downloadStream.pipe(writeFile);

    downloadStream.on("end", () => {
      res.send(readFileSync(join(tempDir, `${id}.mp3`)));
    });

    downloadStream.on("error", (err) => {
      res.json({ ok: false, error: err.message });
    });
  } catch (error) {
    res.json({ ok: false, error: "something went wrong with backend" });
  }
});

export default router;
