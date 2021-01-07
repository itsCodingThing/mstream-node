import express from "express";
import cors from "cors";
import homeRoute from "./routes/home";
import streamRoute from "./routes/stream";

const app = express();

app.use(cors());
app.use("/", homeRoute);
app.use("/stream", streamRoute);

export default app;
