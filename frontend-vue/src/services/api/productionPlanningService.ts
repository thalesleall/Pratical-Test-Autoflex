import { apiClient } from './config'
import type { ProductionSuggestion } from '@/types/api'

export const productionPlanningService = {
  async getSuggestion(): Promise<ProductionSuggestion[]> {
    return apiClient.get<ProductionSuggestion[]>('/production/suggestion')
  },
}
