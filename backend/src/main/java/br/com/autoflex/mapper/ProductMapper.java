package br.com.autoflex.mapper;

import br.com.autoflex.dto.ProductDTO;
import br.com.autoflex.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface ProductMapper {

    Product toEntity(ProductDTO dto);

    ProductDTO toDTO(Product entity);

    void updateEntityFromDTO(ProductDTO dto, @MappingTarget Product entity);
}