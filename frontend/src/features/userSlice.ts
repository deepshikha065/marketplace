import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLoginApi, registerUserApi } from "../service/getService";

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

interface UserPayload {
  user: UserInfo;
  token?: string;
  message?: string;
}

interface UserState {
  user: UserPayload;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: UserState = {
  user: {
    user: {
      name: "",
      email: "",
      role: "",
    },
  },
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await adminLoginApi(data);
      return res;
    } catch (error: unknown) {
      const errorMessage = (error as ApiError)?.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
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
    } catch (error: unknown) {
      const errorMessage = (error as ApiError)?.response?.data?.message || "Sign up failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const handlePending = (state: UserState) => {
  state.loading = true;
  state.error = null;
};
const handleReject = (state: UserState, action: { payload: unknown }) => {
  state.loading = false;
  state.error = action.payload as string;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOutUser(state) {
      state.user = initialState.user;
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
