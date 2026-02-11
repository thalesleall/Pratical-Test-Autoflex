export { apiClient, type ApiError } from "./config";
export { productService } from "./productService";
export { rawMaterialService } from "./rawMaterialService";
export { productCompositionService } from "./productCompositionService";
export { productionPlanningService } from "./productionPlanningService";

export type { ProductDTO, RawMaterialDTO, CompositionDTO, ProductWithComposition, ProductionSuggestion } from "@/types/api";
