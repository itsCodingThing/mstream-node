import app from "./app";
import { connectToDb } from "./database/db";
import TempDir from "./utils/tempDir";

const PORT: number | string = process.env.PORT || 1729;

// Setting a temp directory in system temp directory
export const tempDir = new TempDir("mstream");

export const gridfs = await connectToDb();

app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`);
});
