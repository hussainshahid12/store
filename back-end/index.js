import express from "express";
const app = express();
import "./DB/config.js";
import account_router from "./routes/userAccount.js";
import otp_router from "./routes/verify_otp.js";
// Middleware to parse JSON bodies
app.use(express.json());

// Routes middlewares
app.use("/account", account_router);
app.use("/verify_otp", otp_router);


//Not found route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(2000, () => {
  console.log("Server is running on port 2000");
});
