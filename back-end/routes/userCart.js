import express from "express";
const cart_router = express.Router();
import UserCart from "../controller/userCart.js";
import { Auth } from "../middleware/Auth.js";

// Define your user account routes here

cart_router
  .get("/", Auth, UserCart.getCart)
  .post("/add", Auth,UserCart.addToCart)
  .put("/update", Auth,UserCart.updateQuantity)
  .delete("/remove/:id", Auth,UserCart.removeItem);

export default cart_router;
