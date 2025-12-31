// src/services/authService.js
import { api } from "./api";

export const loginUserService = async (userData) => {
  const response = await api.post("/account/login", userData);
  return response.data;
};
