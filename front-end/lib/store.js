import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/user";
import productSlice from "./features/productSlice/product"


export const store = configureStore({
  reducer: {
    user: userSlice,
    product:productSlice
  },
});