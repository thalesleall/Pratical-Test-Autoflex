package br.com.autoflex.service;

import br.com.autoflex.dto.CompositionDTO;

public interface CompositionService {
    CompositionDTO addComposition(Long productId, CompositionDTO dto);
    CompositionDTO updateComposition(Long productId, Long rawMaterialId, CompositionDTO dto);
    void removeComposition(Long productId, Long rawMaterialId);
}