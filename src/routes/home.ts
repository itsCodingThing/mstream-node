import express, { Request, Response } from "express";
import { connectToDb } from "../database/db";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const { gfs } = await connectToDb();
  const docs = await gfs.find().toArray();
  res.json(docs);
});

router.post("/:songName", async (req: Request, res: Response) => {
  const { gfs } = await connectToDb();

  const name = req.params.songName;

  const uploadStream = gfs.openUploadStream(name);
  req.pipe(uploadStream);
  res.json({ ok: true });
});

router.get("/:id", async (req: Request, res: Response) => {
  const { gfs } = await connectToDb();

  const songID = req.params.id;

  const id = mongoose.Types.ObjectId(songID);
  gfs.openDownloadStream(id).pipe(res);
});

export default router;
