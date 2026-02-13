package br.com.autoflex.mapper;

import br.com.autoflex.dto.CompositionDTO;
import br.com.autoflex.model.CompositionProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta")
public interface CompositionMapper {
    @Mapping(source = "rawMaterial.id", target = "rawMaterialId")
    @Mapping(source = "rawMaterial.name", target = "rawMaterialName")
    @Mapping(source = "necessaryMaterial", target = "quantity")
    CompositionDTO toDTO(CompositionProduct entity);
}