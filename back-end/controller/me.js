export const getMe = (req, res) => {
  console.log(req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  // You can return any user info you want here
  res.json({
    user: {
      id: req.user.id || req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      status: req.user.status,
    },
  });
};
