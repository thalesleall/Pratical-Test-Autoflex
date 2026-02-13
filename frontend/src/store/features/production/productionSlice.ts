import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productionPlanningService } from "@/services/api/productionPlanningService";
import type { ProductionSuggestion } from "@/types/api";

interface ProductionState {
  suggestions: ProductionSuggestion[];
  selectedProducts: Record<number, number>;
  loading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  suggestions: [],
  selectedProducts: {},
  loading: false,
  error: null,
};

export const fetchProductionSuggestions = createAsyncThunk("production/fetchSuggestions", async () => {
  const result = await productionPlanningService.getSuggestion();

  // Normaliza os dados da API para o formato esperado
  return result.map((suggestion, index) => ({
    productId: suggestion.productId ?? index + 1,
    productName: suggestion.productName,
    productValue: suggestion.productValue ?? suggestion.unitValue ?? 0,
    maxProducibleQuantity: suggestion.maxProducibleQuantity ?? suggestion.producibleQuantity ?? 0,
    estimatedRevenue: suggestion.estimatedRevenue ?? suggestion.totalValueEstimate ?? 0,
  }));
});

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    setProductQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity > 0) {
        state.selectedProducts[productId] = quantity;
      } else {
        delete state.selectedProducts[productId];
      }
    },
    clearSelection: (state) => {
      state.selectedProducts = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchProductionSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch production suggestions";
      });
  },
});

export const { setProductQuantity, clearSelection } = productionSlice.actions;
export default productionSlice.reducer;
