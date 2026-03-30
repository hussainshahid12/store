import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // 🔥 ADD THIS

const MONGO_URI = process.env.MongoDB_URL;

if (!MONGO_URI) {
  throw new Error("❌ MongoDB_URL missing");
}

// 🔥 GLOBAL CACHE (IMPORTANT FOR VERCEL)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
