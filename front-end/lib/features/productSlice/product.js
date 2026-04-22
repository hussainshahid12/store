import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProductsService,
  getProductCountService,
  getALLCategoryService,
  getFilterCategoryService,
  getProductDetailService,
  getSearchproductService,
  getTagProductsService,
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
  },
);

export const fetchTagProducts = createAsyncThunk(
  "product/fetchTagProducts",
  async (tag, { rejectWithValue }) => {
    try {
      return await getTagProductsService(tag);
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchProductCount = createAsyncThunk(
  "product/fetchProductCount",
  async ({ count, category }, { rejectWithValue }) => {
    try {
      let res = await getProductCountService(count, category);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
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
  },
);

export const fetchFilterCategory = createAsyncThunk(
  "product/fetchFilterCategory",
  async ({ page, category, sort, order }, { rejectWithValue }) => {
    try {
      let res = await getFilterCategoryService(page, category, sort, order);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchProductDetail = createAsyncThunk(
  "product/fetchProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      let res = await getProductDetailService(id);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchSearchProduct = createAsyncThunk(
  "product/fetchSearchProduct",
  async (query, { rejectWithValue }) => {
    try {
      let res = await getSearchproductService(query);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  items: [],
  tagProducts: {
    new_arrivals:[],
    trending:[]
  },
  searchItems: [], // empty array so you can safely map over it
  totalProducts: 0, // start at 0
  error: null, // no error initially
  isLoading: false, // not loading initially
  category: "", // empty string instead of null
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
        state.items = null;
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
      .addCase(fetchTagProducts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTagProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tagProducts.new_arrivals = action.payload;
        state.error = null;
      })
      .addCase(fetchTagProducts.rejected, (state, action) => {
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
      })

      .addCase(fetchFilterCategory.pending, (state, action) => {
        state.items = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilterCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchFilterCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetail.pending, (state, action) => {
        state.items = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSearchProduct.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchItems = action.payload;
        state.error = null;
      })
      .addCase(fetchSearchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = productSlice.actions;

export default productSlice.reducer;
