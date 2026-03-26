import axios from "axios";
export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://192.168.0.105:2000"
      : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, //  important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});
