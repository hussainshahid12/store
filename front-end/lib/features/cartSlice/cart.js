import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addItemService,
  getCartIemsService,
  updateCartService,
  removeCartService,

} from "@/services/cartService";

export const fetchAddItem = createAsyncThunk(
  "cart/fetchAddItem",
  async (item, { rejectWithValue }) => {
    try {
      let res = await addItemService(item);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      let res = await getCartIemsService();
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchCartUdateQnty = createAsyncThunk(
  "cart/fetchCartUdateQnty",
  async (data, { rejectWithValue }) => {
    try {
      let res = await updateCartService(data);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchCartItemRmove = createAsyncThunk(
  "cart/fetchCartItemRmove",
  async ({ productId }, { rejectWithValue }) => {
    try {
      let res = await removeCartService(productId);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  items: [],
  error: null,
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetState: (state) => {
      state.items = null;
      state.error = null;
      state.isLoading = false;
    },
    resetCartStatus: (state) => {
      state.items.success = false;
      state.items.message = null;
      state.error = null;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddItem.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchAddItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCartItems.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;

        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCartUdateQnty.pending, (state, action) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartUdateQnty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })

      .addCase(fetchCartUdateQnty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCartItemRmove.pending, (state, action) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItemRmove.fulfilled, (state, action) => {
        state.isLoading = false;

        state.items = action.payload;

        state.error = null;
      })

      .addCase(fetchCartItemRmove.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState, decrement, incrementByAmount, resetCartStatus } =
  cartSlice.actions;

export default cartSlice.reducer;
