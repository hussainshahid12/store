// src/services/authService.js
import { api } from "./api";

export const loginUserService = async (userData) => {
  const response = await api.post("/api/account/login", userData);
  return response.data;
};

export const signUpUserService = async (userData) => {
  const response = await api.post("/api/account/register", userData);
  return response.data;
};

export const otpVerifyService = async (data) => {
  const response = await api.post("/api/verify_otp", data);
  return response.data;
};


export const logoutService = async () => {
  const response = await api.get("/api/account/logout");
  return response.data;
};



