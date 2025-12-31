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
      if ((!fullName, !email, !mobileNumber, !password)) {
        customErrorHandler(
          { statusCode: 400, message: "All fields are required" },
          req,
          res
        );
        return;
      }
      const user = new User(req.body);

      const saltRounds = Number(process.env.saltRounds);
      const hash = await bcrypt.hash(password, saltRounds);
      user.password = hash;
      await user.save();

      const otp = generateOtp();
      const newOtp = new Otp({ userId: user._id, otp: otp });
      await newOtp.save();

      //Otp send mail
      await sendOtpEmail(email, otp);

      res.status(201).json({ message: "OTP sent to your email", user });
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
        status:existUser.isVerified
      });
    } catch (err) {
      return customErrorHandler(
        { statusCode: 400, message: err.message },
        req,
        res
      );
    }
  }
}

export { UserAccount };
