import express from "express";
const order_router = express.Router();
import order from "../controller/order.js";
import { Auth } from "../middleware/Auth.js";

order_router
  .get("/buy-now", order.buyNowItem)
  .post("/create", Auth, order.createOrder)
  .get("/my-orders", Auth, order.getMyOrders)
  .get("/my-order-address", Auth, order.getMyOrderAddress)
  .get("/:id", Auth, order.getSingleOrder)
  .put("/cancel/:id", Auth, order.cancelOrder);

export default order_router;
