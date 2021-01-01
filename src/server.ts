import app from "./app";
import { connectToDb } from "./database/db";
import { mkdtempSync } from "fs";
import { join, sep } from "path";
import { tmpdir } from "os";

const PORT: number | string = process.env.PORT || 1729;

// Setting a temp directory in system temp directory
const systemTempDir = tmpdir();
export const tempDir = mkdtempSync(join(`${systemTempDir}${sep}mstream--`));

app.listen(PORT, async () => {
  try {
    await connectToDb();
    console.log(`server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
