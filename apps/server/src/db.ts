import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("DB connected");
};
