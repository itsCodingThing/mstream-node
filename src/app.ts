import express from "express";
import homeRoute from "./routes/home";

const app = express();

app.use("/", homeRoute);

export default app;
