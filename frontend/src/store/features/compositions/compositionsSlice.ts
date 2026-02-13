import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productCompositionService } from "@/services/api/productCompositionService";
import type { CompositionDTO } from "@/types/api";

interface CompositionsState {
  currentProductId: number | null;
  compositions: CompositionDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: CompositionsState = {
  currentProductId: null,
  compositions: [],
  loading: false,
  error: null,
};

export const fetchCompositions = createAsyncThunk("compositions/fetchByProduct", async (productId: number) => {
  return await productCompositionService.getByProduct(productId);
});

export const addComposition = createAsyncThunk("compositions/add", async ({ productId, composition }: { productId: number; composition: CompositionDTO }) => {
  await productCompositionService.addRawMaterial(productId, composition);
  return await productCompositionService.getByProduct(productId);
});

export const updateComposition = createAsyncThunk(
  "compositions/update",
  async ({ productId, rawMaterialId, composition }: { productId: number; rawMaterialId: number; composition: CompositionDTO }) => {
    await productCompositionService.updateRawMaterialQuantity(productId, rawMaterialId, composition);
    return await productCompositionService.getByProduct(productId);
  },
);

export const deleteComposition = createAsyncThunk("compositions/delete", async ({ productId, rawMaterialId }: { productId: number; rawMaterialId: number }) => {
  await productCompositionService.removeRawMaterial(productId, rawMaterialId);
  return rawMaterialId;
});

const compositionsSlice = createSlice({
  name: "compositions",
  initialState,
  reducers: {
    clearCompositions: (state) => {
      state.currentProductId = null;
      state.compositions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompositions.fulfilled, (state, action) => {
        state.loading = false;
        state.compositions = action.payload;
        state.currentProductId = action.meta.arg;
      })
      .addCase(fetchCompositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch compositions";
      })
      .addCase(addComposition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComposition.fulfilled, (state, action) => {
        state.loading = false;
        state.compositions = action.payload;
      })
      .addCase(addComposition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add composition";
      })
      .addCase(updateComposition.fulfilled, (state, action) => {
        state.compositions = action.payload;
      })
      .addCase(deleteComposition.fulfilled, (state, action) => {
        state.compositions = state.compositions.filter((c) => c.rawMaterialId !== action.payload);
      });
  },
});

export const { clearCompositions } = compositionsSlice.actions;
export default compositionsSlice.reducer;
