import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./DB/config.js";

import account_router from "./routes/userAccount.js";
import otp_router from "./routes/verify_otp.js";
import product_router from "./routes/product.js";
import cart_router from "./routes/userCart.js";
import order_router from "./routes/order.js";

const app = express();

// ✅ DB
connectDB();

// 🔥 PUT IT HERE (VERY TOP)
app.set("trust proxy", 1);

// ================= CORS =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_LAN,
  process.env.FRONTEND_URL_PROD,
];

app.use(
  cors({
    origin: process.env.FRONTEND_URL_PROD,
    credentials: true,
  }),
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================
app.use("/api/account", account_router);
app.use("/api/verify_otp", otp_router);
app.use("/api/product", product_router);
app.use("/api/cart", cart_router);
app.use("/api/order", order_router);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= 🔥 DYNAMIC SERVER =================
const isVercel = process.env.NODE_ENV === "production";

if (!isVercel) {
  const PORT = process.env.PORT || 2000;

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

// ✅ EXPORT for Vercel
export default app;
