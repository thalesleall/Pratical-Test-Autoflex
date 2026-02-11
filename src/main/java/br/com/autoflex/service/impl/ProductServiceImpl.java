package br.com.autoflex.service.impl;

import br.com.autoflex.dto.ProductDTO;
import br.com.autoflex.mapper.ProductMapper;
import br.com.autoflex.model.Product;
import br.com.autoflex.repository.ProductRepository;
import br.com.autoflex.service.ProductService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductServiceImpl implements ProductService {

    @Inject
    ProductRepository repository;

    @Inject
    ProductMapper mapper;

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product entity = mapper.toEntity(productDTO);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return repository.listAll().stream().map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product entity = repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return mapper.toDTO(entity);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product entity = repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        mapper.updateEntityFromDTO(productDTO, entity);
        return mapper.toDTO(entity);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        boolean deleted = repository.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Product not found");
        }
    }
}