export const Auth = (req, res, next) => {
  try {
    const token =
      req.cookies?.JWT_Token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = Jwt.verify(token, process.env.JWT_SECURITY);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
