import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLoginApi, registerUserApi } from "../../service/getService";

interface UserState {
  user?: any | null;
  loading?: boolean;
  error?: string | null;
  isAuthenticated?: boolean;
  token?: string | null;
}

const initialState: UserState = {
  user: {
    name: "",
    email: "",
    role: "",
  },
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
};

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await adminLoginApi(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const resigterUser = createAsyncThunk(
  "auth/resigterUser",
  async (
    data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await registerUserApi(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Sign up failed");
    }
  }
);

const handlePending = (state: UserState) => {
  state.loading = true;
  state.error = null;
};
const handleReject = (state: UserState, action: any) => {
  state.loading = false;
  state.error = action.payload;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, handlePending)
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(adminLogin.rejected, handleReject)
      .addCase(resigterUser.pending, handlePending)
      .addCase(resigterUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(resigterUser.rejected, handleReject);
  },
});

export const { logOutUser } = userSlice.actions;

export default userSlice.reducer;
