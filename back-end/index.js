import express from "express";
const app = express();
import cors from "cors";
import "./DB/config.js";
import account_router from "./routes/userAccount.js";
import otp_router from "./routes/verify_otp.js";
import cookieParser from "cookie-parser";
import product_router from "./routes/product.js";

const corsOtions = {
  // origin:true, for teting both pc or mobile
  origin: [
    "http://localhost:3000",
    "http://192.168.0.106:3000" // mobile testing 
  ],
  
  credentials: true,
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOtions));

// Routes middlewares
app.use("/account", account_router);
app.use("/verify_otp", otp_router);
app.use("/products", product_router);

//Not found route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(2000,() => {
  console.log("Server is running on port 2000");
});
