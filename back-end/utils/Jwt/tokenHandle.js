import Jwt from "jsonwebtoken";

export const JWTTokenSign = (existUser) => {
  let token = Jwt.sign(
    { email: existUser.email, fullName: existUser.fullName, id: existUser._id },
    process.env.JWT_SECURITY
  );
  return token;
};
