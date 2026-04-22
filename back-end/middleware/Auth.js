import Jwt from "jsonwebtoken";
import customErrorHandler from "../errorHanlding/error.js";

export const Auth = (req, res, next) => {
  console.log("fire");
  try {
    const token =
      req.cookies?.JWT_Token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("token failed");
      return res.status(401).json({ message: "No token.." });
    }

    const decoded = Jwt.verify(token, process.env.JWT_SECURITY);
    console.log("token pass");

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
