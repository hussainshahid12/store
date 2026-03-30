import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./DB/config.js";

import account_router from "./routes/userAccount.js";
import otp_router from "./routes/verify_otp.js";
import product_router from "./routes/product.js";
import cart_router from "./routes/userCart.js";
import order_router from "./routes/order.js";


dotenv.config();

const app = express();

// ✅ Connect DB
connectDB();

// ================= CORS (FINAL) =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_LAN,
  process.env.FRONTEND_URL_PROD,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================
app.use("/account", account_router);
app.use("/verify_otp", otp_router);
app.use("/product", product_router);
app.use("/cart", cart_router);
app.use("/order", order_router);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});