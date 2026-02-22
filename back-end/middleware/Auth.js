import Jwt from "jsonwebtoken";
import customErrorHandler from "../errorHanlding/error.js";

export const Auth = (req, res, next) => {
  try {
    const token = req.cookies?.JWT_Token;

    if (!token) {
      customErrorHandler(
        { status: 401, message: "Unauthorized - No token" },
        req,
        res,
      );
      return;
    }

    const decoded = Jwt.verify(token, process.env.JWT_SECURITY);
    console.log(decoded);

    req.user = decoded;

    next();
  } catch (err) {
    customErrorHandler({ status: 401, message: "Invalid token" }, req, res);
  }
};
