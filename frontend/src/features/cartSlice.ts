import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getProductCartApi,
  addProductApi,
  updateCartItemApi,
  removeCartItemApi,
} from "../service/getService";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number | string;
    image: string;
    category: string;
  };
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "failed";
}

const initialState: CartState = {
  items: [],
  status: "idle",
};

// Async Thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await getProductCartApi();
  return response.items || [];
});

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (payload: { productId: string; quantity: number }, { dispatch }) => {
    await addProductApi(payload);
    dispatch(fetchCart());
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (payload: { itemId: string; quantity: number }, { dispatch }) => {
    await updateCartItemApi(payload.itemId, payload.quantity);
    dispatch(fetchCart());
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId: string, { dispatch }) => {
    await removeCartItemApi(itemId);
    dispatch(fetchCart()); // Refresh cart after removing
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
