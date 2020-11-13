import app from "./app";
import { connectToDb } from "./database/db";

const port: number | string = process.env.PORT || 1729;

app.listen(port, async () => {
  try {
    await connectToDb();
    console.log(`server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
