import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/products/productsSlice";
import rawMaterialsReducer from "./features/rawMaterials/rawMaterialsSlice";
import compositionsReducer from "./features/compositions/compositionsSlice";
import productionReducer from "./features/production/productionSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    compositions: compositionsReducer,
    production: productionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
