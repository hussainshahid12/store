import axios from "axios";
export const api = axios.create({
  baseURL: "http://192.168.0.105:2000",
  withCredentials: true, //  important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});


