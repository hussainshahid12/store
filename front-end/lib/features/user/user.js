import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserService } from "@/services/accountServices";

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
  }
);

const initialState = {
  userInfo: null,
  error: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
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
      });
  },
});

export const { increment, decrement, incrementByAmount } = userSlice.actions;

export default userSlice.reducer;
