import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProductsService,
  getProductCountService,
  getALLCategoryService,
} from "@/services/productService";

export const fetchGetProducts = createAsyncThunk(
  "product/fetchGetProducts",
  async ({ currentPage, order }, { rejectWithValue }) => {
    try {
    return await getProductsService(currentPage, order);
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProductCount = createAsyncThunk(
  "product/fetchProductCount",
  async (pageNo, { rejectWithValue }) => {
    try {
      let res = await getProductCountService();
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchALLCategory = createAsyncThunk(
  "product/fetchALLCategory",
  async (_, { rejectWithValue }) => {
    try {
      let res = await getALLCategoryService();
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  items: null,
  totalProducts: null,
  error: null,
  isLoading: false,
  category: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
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
      .addCase(fetchGetProducts.pending, (state, action) => {
        state.items=nullur
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchGetProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductCount.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchProductCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchALLCategory.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchALLCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.category = action.payload;
        state.error = null;
      })
      .addCase(fetchALLCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = productSlice.actions;

export default productSlice.reducer;
