import User from "../model/account.js";
import Otp from "../model/otp.js";
import generateOtp from "../utils/generateOtp.js";
import customErrorHandler from "../errorHanlding/error.js";
import bcrypt from "bcrypt";



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
      console.log("******", otp);
      const newOtp = new Otp({ userId: user._id, otp: otp });
      await newOtp.save();

      res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
      customErrorHandler({ statusCode: 500, message: err.message }, req, res);
    }
  }
}

export { UserAccount };
