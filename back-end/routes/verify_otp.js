import express from "express";
const otp_router = express.Router();
import { verifyOtp } from "../controller/otp_verify.js";


otp_router.post("/", verifyOtp);

export default otp_router;