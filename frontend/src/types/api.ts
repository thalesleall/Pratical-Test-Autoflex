export interface ProductDTO {
  id?: number;
  name: string;
  value: number;
  composition?: CompositionDTO[];
}

export interface RawMaterialDTO {
  id?: number;
  name: string;
  quantity: number;
}

export interface CompositionDTO {
  rawMaterialId: number;
  rawMaterialName?: string;
  quantity: number;
}

export interface ProductWithComposition extends ProductDTO {
  rawMaterials?: CompositionDTO[];
}

export interface ProductionSuggestion {
  productId?: number;
  productName: string;
  productValue?: number;
  unitValue?: number; // Valor unitário do produto (alias para productValue)
  maxProducibleQuantity?: number;
  producibleQuantity?: number; // Quantidade produzível (alias para maxProducibleQuantity)
  estimatedRevenue?: number;
  totalValueEstimate?: number; // Estimativa de valor total (alias para estimatedRevenue)
}
