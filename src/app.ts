import express from "express";
import cors from "cors";
import homeRoute from "./routes/home";

const app = express();

app.use(cors());
app.use("/", homeRoute);

export default app;
