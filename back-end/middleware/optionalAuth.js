import Jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  console.log("fire")
  const token = req.cookies?.JWT_Token;

  if (!token) {
    console.log("token failed")
    return next();
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECURITY);
      console.log("token pass")
    req.user = decoded;
  } catch (err) {}

  next();
};