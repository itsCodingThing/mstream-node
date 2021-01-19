import "reflect-metadata";
import app from "./app";
import { connectToDb } from "./database/db";

const PORT: number | string = process.env.PORT || 1729;

export const gridfs = await connectToDb();

app.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}`);
});
