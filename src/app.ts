import express from "express";
import cors from "cors";
import morgon from "morgan";
import router from "./routes/routes";
import errorHandler from "./utils/errorHandler";

const app = express();

app.use(morgon("dev"));
app.use(cors());
app.use(express.json());

app.use("/", router);

// Setting a Error hadler for whole app
app.use(errorHandler);

export default app;
