package br.com.autoflex.mapper;

import br.com.autoflex.dto.ProductDTO;
import br.com.autoflex.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "jakarta", uses = {CompositionMapper.class})
public interface ProductMapper {

    @Mapping(target = "composition", ignore = true)
    Product toEntity(ProductDTO dto);

    ProductDTO toDTO(Product entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "composition", ignore = true)
    void updateEntityFromDTO(ProductDTO dto, @MappingTarget Product entity);
}