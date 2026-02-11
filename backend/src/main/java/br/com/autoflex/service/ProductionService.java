package br.com.autoflex.service;

import br.com.autoflex.dto.ProductionSuggestionDTO;
import java.util.List;

public interface ProductionService {
    List<ProductionSuggestionDTO> getProductionSuggestion();
}