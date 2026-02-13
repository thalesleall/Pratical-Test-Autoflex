package br.com.autoflex.mapper;

import br.com.autoflex.dto.RawMaterialDTO;
import br.com.autoflex.model.RawMaterial;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "jakarta")
public interface RawMaterialMapper {

    RawMaterial toEntity(RawMaterialDTO dto);

    RawMaterialDTO toDTO(RawMaterial entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(RawMaterialDTO dto, @MappingTarget RawMaterial entity);
}