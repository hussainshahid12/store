import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
  try {
    const info = await transporter.sendMail({
      from: `" Pak Bazar" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
      `,
    });

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Email send failed:", error.message);

    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};
