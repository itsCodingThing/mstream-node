import app from "./app";
import { connectToDb } from "./database/db";
import { mkdtempSync } from "fs";
import { join, sep } from "path";
import { tmpdir } from "os";

const PORT: number | string = process.env.PORT || 1729;

// Setting a temp directory in system temp directory
const systemTempDir = tmpdir();
export const tempDir = mkdtempSync(join(`${systemTempDir}${sep}mstream--`));

export const gridfs = await connectToDb();

app.listen(PORT, async () => {
    try {
        console.log(
            `${process.env.NODE_ENV === "development" ? process.env.NODE_ENV : ""} server is running on port ${PORT}`,
        );
    } catch (error) {
        console.log(error);
    }
});
