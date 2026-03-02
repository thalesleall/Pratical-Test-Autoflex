export interface ProductDTO {
  id?: number
  name: string
  value: number
}

export interface RawMaterialDTO {
  id?: number
  name: string
  quantity: number
}

export interface CompositionDTO {
  rawMaterialId: number
  rawMaterialName?: string
  quantity: number
}

export interface ProductWithComposition extends ProductDTO {
  rawMaterials?: CompositionDTO[]
}

export interface ProductionSuggestion {
  productName: string
  producibleQuantity: number
  unitValue: number
  totalValueEstimate: number
}
