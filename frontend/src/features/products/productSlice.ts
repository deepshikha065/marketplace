import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductByIdApi, getProductsApi } from "../../service/getService";

interface ProductsState {
  products: any[];
  selectedProduct: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await getProductsApi();
    return response;
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await getProductByIdApi(id);
      console.log("getProductById", response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(getProducts.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch products";
      })
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch product details";
      });
  },
});

export default productSlice.reducer;
