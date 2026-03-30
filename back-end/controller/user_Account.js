import User from "../model/account.js";
import Otp from "../model/otp.js";
import generateOtp from "../utils/generateOtp.js";
import customErrorHandler from "../errorHanlding/error.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../email/sendOTP.js";
import { JWTTokenSign } from "../utils/Jwt/tokenHandle.js";

class UserAccount {
  //  add methods and properties related to user accounts here
  static async signup(req, res) {
    try {
      const { fullName, email, mobileNumber, password } = req.body;

      if (!fullName || !email || !mobileNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password first
      const saltRounds = Number(process.env.saltRounds);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const otp = generateOtp();
      console.log("Generated OTP:", otp);

      // ✅ Send email FIRST
      const result = await sendOtpEmail(email, otp);

      if (!result.success) {
        return res.status(500).json({
          message: "Email failed. User not created.",
        });
      }

      // ✅ Only save if email success
      const user = new User({
        fullName,
        email,
        mobileNumber,
        password: hashedPassword,
      });

      await user.save();

      const newOtp = new Otp({
        userId: user._id,
        otp,
      });

      await newOtp.save();

      res.status(201).json({
        message: "Signup successful. OTP sent.",
        userId: user._id,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async login(req, res) {
    const isProduction = process.env.NODE_ENV === "production";
    const { email, password } = req.body;

    try {
      const existUser = await User.findOne({ email });

      if (!existUser) {
        return res.status(404).json({ message: "Email not found" });
      }

      const isAuth = bcrypt.compareSync(password, existUser.password);

      if (!isAuth) {
        return res.status(401).json({ message: "Password not matched" });
      }

      // token sign
      const token = JWTTokenSign(existUser);

      res.cookie("JWT_Token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });

      return res.status(200).json({
        message: "Login successfully",
        token,
        isVerified: existUser.isVerified,
      });
    } catch (err) {
      return customErrorHandler(
        { statusCode: 400, message: err.message },
        req,
        res,
      );
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("JWT_Token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      // ❗ IMPORTANT:
      // DO NOT clear sessionId (cart will break)
      // DO NOT clear lastUserId (needed for same cart after logout)

      res.status(200).json({
        success: true,
        message: "Account Logout Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default UserAccount;
