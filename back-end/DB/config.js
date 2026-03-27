import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    if (cached.conn) {
      console.log(" Using existing DB connection");
      return cached.conn;
    }

    const mongoUrl = process.env.MongoDB_URL;

    if (!mongoUrl) {
      throw new Error(" MongoDB_URL missing");
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(mongoUrl).then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;

  } catch (error) {
    console.log(" MongoDB Error:", error.message);
    throw error;
  }
};

export default connectDB;