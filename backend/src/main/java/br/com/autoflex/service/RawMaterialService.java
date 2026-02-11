package br.com.autoflex.service;

import br.com.autoflex.dto.RawMaterialDTO;
import java.util.List;

public interface RawMaterialService {
    RawMaterialDTO create(RawMaterialDTO dto);
    List<RawMaterialDTO> getAll();
    RawMaterialDTO getById(Long id);
    RawMaterialDTO update(Long id, RawMaterialDTO dto);
    void delete(Long id);
}