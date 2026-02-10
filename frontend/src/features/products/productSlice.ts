import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addProductApi,
  getProductCartApi,
  getProductsApi,
  getProductByIdApi,
  updateCartItemApi,
  removeCartItemApi,
} from "../../service/getService";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface ProductState {
  products: any[];
  selectedProduct: any | null;
  cart: {
    items: CartItem[];
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  cart: {
    items: [],
  },
  isLoading: false,
  error: null,
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    return await getProductsApi();
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await getProductByIdApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCart = createAsyncThunk("products/getCart", async () => {
  return await getProductCartApi();
});

export const addToCart = createAsyncThunk(
  "products/addToCart",
  async (data: { productId: string; quantity: number }, { dispatch }) => {
    const response = await addProductApi(data);
    dispatch(getCart()); // Refresh cart after adding
    return response;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "products/updateCartQuantity",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { dispatch }
  ) => {
    const response = await updateCartItemApi(itemId, quantity);
    dispatch(getCart()); // Refresh cart after update
    return response;
  }
);

export const removeFromCart = createAsyncThunk(
  "products/removeFromCart",
  async (itemId: string, { dispatch }) => {
    const response = await removeCartItemApi(itemId);
    dispatch(getCart()); // Refresh cart after removal
    return response;
  }
);

/* ===================== SLICE ===================== */

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* PRODUCTS */
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      /* PRODUCT BY ID */
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch product";
      })

      /* CART */
      .addCase(getCart.fulfilled, (state, action) => {
        state.cart.items = action.payload.items;
      });
  },
});

export const { clearCart } = productSlice.actions;

export default productSlice.reducer;
