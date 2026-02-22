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

      // Correct validation
      if (!fullName || !email || !mobileNumber || !password) {
        return customErrorHandler(
          { statusCode: 400, message: "All fields are required" },
          req,
          res,
        );
      }

      // Check existing user (recommended)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const user = new User(req.body);

      const saltRounds = Number(process.env.saltRounds);
      const hash = await bcrypt.hash(password, saltRounds);
      user.password = hash;

      await user.save();

      const otp = generateOtp();
      console.log("Generated OTP:", otp);

      const newOtp = new Otp({
        userId: user._id,
        otp,
      });

      await newOtp.save();

      // Send OTP email
      const result = await sendOtpEmail(user.email, otp);

      if (!result.success) {
        return res.status(500).json({
          message: "OTP email failed",
        });
      }

      res.status(201).json({
        message: "Signup successful. OTP sent to email.",
        userId: user._id,
        email,
      });
    } catch (err) {
      customErrorHandler({ statusCode: 500, message: err.message }, req, res);
    }
  }

  static async login(req, res) {
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
        secure: process.env.NODE_ENV === "production",
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
    res.clearCookie("JWT_Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.status(200).json({
      msg: "Account Logout Successfully",
    });
  }
}

export default UserAccount;
