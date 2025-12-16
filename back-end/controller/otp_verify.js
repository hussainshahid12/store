import Otp from "../model/otp.js";
import User from "../model/account.js";
import customErrorHandler from "../errorHanlding/error.js";

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const otpRecord = await Otp.findOne({ userId: userId });
    console.log(otpRecord);

    if (!otpRecord) {
      customErrorHandler({ statusCode: 400, message: "Otp Expire" }, req, res);
      return;
    }

    if (otpRecord.otp !== otp) {
      customErrorHandler({ statusCode: 400, message: "Invalid OTP" }, req, res);
      return;
    }

    await Otp.deleteMany({ userId: userId });
    await User.updateOne({ _id: userId }, { $set: { isVerified: true } });

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    customErrorHandler({ message: err.message }, req, res);
  }
};
