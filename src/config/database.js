import mongoose from "mongoose";

export const dbConnected = async () => {
  return await mongoose.connect(process.env.DB_URL);
};
