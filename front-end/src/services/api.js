import axios from "axios";
const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://localhost:2000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //  important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// No need to set Authorization header from localStorage. Auth is handled by httpOnly cookie.
