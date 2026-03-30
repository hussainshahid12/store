import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MongoDB_URL;

if (!mongoUrl) {
  console.error("❌ MongoDB_URL missing");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};