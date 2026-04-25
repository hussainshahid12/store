import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrderService,
  orderAddressService,
  myOrderTrackService,
  myOrderCancelService,
  myOrderService,
  BuyNowItemService,
} from "@/services/orderService";

export const fetchCreateOrder = createAsyncThunk(
  "order/fetchCreateOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      let res = await createOrderService(orderData);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchMyOrderAddress = createAsyncThunk(
  "order/fetchMyOrderAddress",
  async (_, { rejectWithValue }) => {
    try {
      let res = await orderAddressService();
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchMyTrackOrder = createAsyncThunk(
  "order/fetchMyTrackOrder ",
  async (id, { rejectWithValue }) => {
    try {
      let res = await myOrderTrackService(id);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders ",
  async (_, { rejectWithValue }) => {
    try {
      let res = await myOrderService();
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchMyOrderCancel = createAsyncThunk(
  "order/fetchMyOrderCancel ",
  async (id, { rejectWithValue }) => {
    try {
      let res = await myOrderCancelService(id);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchBuyNowItem = createAsyncThunk(
  "order/fetchBuyNowItem ",
  async ({ id, qty }, { rejectWithValue }) => {
  
    try {
      let res = await BuyNowItemService(id, qty);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  order: [],
  myOrders: [],
  address: [],
  error: null,
  isLoading: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetState: (state) => {
      state.order = null;
      state.error = null;
      state.isLoading = false;
    },
    resetCartStatus: (state) => {
      state.order.success = false;
      state.order.message = null;
      state.error = null;
    },

    resetOrder: (state) => {
      state.order =[];
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateOrder.pending, (state, action) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCreateOrder.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.order = action.payload;
        // myorder is [] i want create new order disptach function run again in order history page
        state.myOrders = [];
        state.error = null;
      })
      .addCase(fetchCreateOrder.rejected, (state, action) => {
        // state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrderAddress.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrderAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.address = action.payload;
        state.error = null;
      })
      .addCase(fetchMyOrderAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyTrackOrder.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyTrackOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(fetchMyTrackOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.order = [];
      })
      .addCase(fetchMyOrderCancel.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrderCancel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        if (state.myOrders.length > 0) {
          const id = state.order._id;

          const index = state.myOrders.findIndex((item) => item._id === id);

          if (index !== -1) {
            state.myOrders.splice(index, 1, state.order);
          }
        }

        state.error = null;
      })
      .addCase(fetchMyOrderCancel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myOrders = action.payload;
        state.error = null;
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBuyNowItem.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBuyNowItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(fetchBuyNowItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState, resetOrder, incrementByAmount, resetCartStatus } =
  orderSlice.actions;

export default orderSlice.reducer;
