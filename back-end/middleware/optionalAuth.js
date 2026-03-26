import Jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  const token = req.cookies?.JWT_Token;

  if (!token) return next();

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECURITY);
    req.user = decoded;
  } catch (err) {}

  next();
};