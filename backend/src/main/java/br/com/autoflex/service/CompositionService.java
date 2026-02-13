package br.com.autoflex.service;

import br.com.autoflex.dto.CompositionDTO;
import java.util.List;

public interface CompositionService {
    List<CompositionDTO> getCompositionsByProduct(Long productId);
    CompositionDTO addComposition(Long productId, CompositionDTO dto);
    CompositionDTO updateComposition(Long productId, Long rawMaterialId, CompositionDTO dto);
    void removeComposition(Long productId, Long rawMaterialId);
}