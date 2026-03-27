import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./DB/config.js";

// Routes
import account_router from "./routes/userAccount.js";
import otp_router from "./routes/verify_otp.js";
import product_router from "./routes/product.js";
import cart_router from "./routes/userCart.js";
import order_router from "./routes/order.js";

dotenv.config();

const app = express();

// ✅ CORS config — allows both laptop (localhost) and mobile (LAN IP)
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowed = [
//       process.env.FRONTEND_URL,
//       process.env.FRONTEND_URL_PROD,
//       "http://192.168.0.105:3000", // your mobile/LAN device
//     ];

//     // Allow requests with no origin (Postman, curl, etc.)
//     if (!origin || allowed.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`CORS blocked: ${origin}`));
//     }
//   },
//   credentials: true, // ✅ Required for cookies (sessionId, JWT_Token)
// };

/* ---------- MIDDLEWARE ---------- */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

/* ---------- ROUTES ---------- */
app.use("/account", account_router);
app.use("/verify_otp", otp_router);
app.use("/product", product_router);
app.use("/cart", cart_router);
app.use("/order", order_router);

/* ---------- 404 ---------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  LOCAL SERVER (Development)
if (process.env.NODE_ENV !== "production") {
  const PORT = 2000;

  app.listen(PORT, async () => {
    await connectDB();
    console.log(` Server running on port ${PORT}`);
  });
}

//  VERCEL HANDLER (Production)
export default async function handler(req, res) {
  console.log(" API HIT");

  await connectDB(); // ensure DB connection

  return app(req, res);
}
