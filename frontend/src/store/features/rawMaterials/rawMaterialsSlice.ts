import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rawMaterialService } from "@/services/api/rawMaterialService";
import type { RawMaterialDTO } from "@/types/api";

interface RawMaterialsState {
  items: RawMaterialDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRawMaterials = createAsyncThunk("rawMaterials/fetchAll", async () => {
  return await rawMaterialService.getAll();
});

export const createRawMaterial = createAsyncThunk("rawMaterials/create", async (material: RawMaterialDTO) => {
  return await rawMaterialService.create(material);
});

export const updateRawMaterial = createAsyncThunk("rawMaterials/update", async ({ id, material }: { id: number; material: RawMaterialDTO }) => {
  return await rawMaterialService.update(id, material);
});

export const deleteRawMaterial = createAsyncThunk("rawMaterials/delete", async (id: number) => {
  await rawMaterialService.delete(id);
  return id;
});

const rawMaterialsSlice = createSlice({
  name: "rawMaterials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch raw materials";
      })
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export default rawMaterialsSlice.reducer;
