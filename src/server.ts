import app from "./app";
import { connectToDb } from "./database/db";

const PORT: number | string = process.env.PORT || 1729;

app.listen(PORT, async () => {
  try {
    await connectToDb();
    console.log(`server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
