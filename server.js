import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import app from "./src/app.js";
import { dbConnected } from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnected();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
