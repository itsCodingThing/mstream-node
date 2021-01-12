import express from "express";

import homeRoute from "./home/home";
import streamRoute from "./stream/stream";
import uploadRoute from "./upload/upload";

const router = express.Router();

router.use("/", homeRoute);
router.use("/stream", streamRoute);
router.use("/upload", uploadRoute);

export default router;
