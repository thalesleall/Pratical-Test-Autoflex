import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "@/services/api/productService";
import type { ProductDTO, ProductWithComposition } from "@/types/api";

interface ProductsState {
  items: ProductWithComposition[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await productService.getAll();
});

export const createProduct = createAsyncThunk("products/create", async (product: ProductDTO) => {
  return await productService.create(product);
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, product }: { id: number; product: ProductDTO }) => {
  return await productService.update(id, product);
});

export const deleteProduct = createAsyncThunk("products/delete", async (id: number) => {
  await productService.delete(id);
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
