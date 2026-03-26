import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice/user";
import productSlice from "./features/productSlice/product";
import cartSlice from "./features/cartSlice/cart";
import orderSlice from "./features/orderSlice/orderSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    cartSlice: cartSlice,
    orderSlice: orderSlice,
  },
});
