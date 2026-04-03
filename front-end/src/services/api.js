import axios from "axios";
const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://192.168.0.107:2000";

export const api = axios.create({
  baseURL: BASE_URL,

  withCredentials: true, //  important for cookies
  headers: {
    "Content-Type": "application/json",
     Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
