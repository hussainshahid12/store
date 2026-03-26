import express from "express";
const router = express.Router();

import UserCart from "../controller/userCart.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

router.get("/", optionalAuth, UserCart.getCart);
router.post("/add", optionalAuth, UserCart.addToCart);
router.put("/update", optionalAuth, UserCart.updateQuantity);
router.delete("/remove/:productId", optionalAuth, UserCart.removeItem);

export default router;