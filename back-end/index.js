import express from "express";
const app = express();
import cors from "cors";
import "./DB/config.js";
import account_router from "./routes/userAccount.js";
import otp_router from "./routes/verify_otp.js";
import cookieParser from "cookie-parser";
import product_router from "./routes/product.js";
import cart_router from "./routes/userCart.js";
import order_router from "./routes/order.js";

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

const corsOptions = {
  origin: true, // allow all origins dynamically
  credentials: true,
};

// Use in your app:
// import cors from "cors";
// app.use(cors(corsOptions));

app.use(cors(corsOptions));

/* --------------- MIDDLEWARES --------------- */
app.use(express.json());
app.use(cookieParser());

// Routes middlewares
app.use("/account", account_router);
app.use("/verify_otp", otp_router);
app.use("/product", product_router);
app.use("/cart", cart_router);
app.use("/order", order_router);

//Not found route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(2000, () => {
  console.log("Server is running on port 2000");
});
