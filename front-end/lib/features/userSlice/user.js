import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUserService,
  signUpUserService,
  otpVerifyService,
  logoutService
} from "@/services/accountServices";

export const fetchLoginUser = createAsyncThunk(
  "user/fetchLoginUser",
  async (userData, { rejectWithValue }) => {
    try {
      let res = await loginUserService(userData);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchSignUpUser = createAsyncThunk(
  "user/fetchSignUpUser",
  async (userData, { rejectWithValue }) => {
    try {
      let res = await signUpUserService(userData);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchOtpVerify = createAsyncThunk(
  "user/fetchOtpVerify",
  async (data, { rejectWithValue }) => {
    try {
      let res = await otpVerifyService(data);
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchUserLogout = createAsyncThunk(
  "user/fetchUserLogout ",
  async (_, { rejectWithValue }) => {
    try {
      let res = await logoutService();
      return res;
    } catch (err) {
      // axios error handling
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
const initialState = {
  userInfo: {},       // empty object instead of null
  error: null,
  isLoading: false,
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: (state) => {
      state.userInfo = null;
      state.error = null;
      state.isLoading = false;
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
      .addCase(fetchLoginUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSignUpUser.pending, (state, action) => {
        state.isLoading = true;
        state.userInfo = null;
        state.error = null;
      })
      .addCase(fetchSignUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchSignUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOtpVerify.pending, (state, action) => {
        state.isLoading = true;
        state.userInfo = null;
        state.error = null;
      })
      .addCase(fetchOtpVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchOtpVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.userInfo = null;
        state.error = action.payload;
      })
      .addCase(fetchUserLogout.pending, (state, action) => {
        state.isLoading = true;
        state.userInfo = null;
        state.error = null;
      })
      .addCase(fetchUserLogout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchUserLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.userInfo = null;
        state.error = action.payload;
      });
  },
});

export const { resetState, decrement, incrementByAmount } = userSlice.actions;

export default userSlice.reducer;
