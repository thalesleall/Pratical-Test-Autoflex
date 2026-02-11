package br.com.autoflex.mapper;

import br.com.autoflex.dto.RawMaterialDTO;
import br.com.autoflex.model.RawMaterial;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface RawMaterialMapper {

    RawMaterial toEntity(RawMaterialDTO dto);

    RawMaterialDTO toDTO(RawMaterial entity);

    void updateEntityFromDTO(RawMaterialDTO dto, @MappingTarget RawMaterial entity);
}