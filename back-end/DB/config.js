import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MongoDB_URL;

if (!mongoUrl) {
  console.error(
    "Missing MongoDB_URL in environment. Ensure .env is present and dotenv is configured."
  );
  process.exit(1);
}

main().catch((err) => console.log("Error connecting to MongoDB:", err));

async function main() {
  await mongoose.connect(mongoUrl);
  console.log("Connected to MongoDB");
}
