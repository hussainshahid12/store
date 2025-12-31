import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // easy for beginners
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password
  },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"HS Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in <b>5 minutes</b>.</p>
    `,
  });
};
