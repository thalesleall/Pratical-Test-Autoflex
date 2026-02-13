package br.com.autoflex.service.impl;

import br.com.autoflex.dto.CompositionDTO;
import br.com.autoflex.mapper.CompositionMapper;
import br.com.autoflex.model.*;
import br.com.autoflex.repository.CompositionRepository;
import br.com.autoflex.repository.ProductRepository;
import br.com.autoflex.repository.RawMaterialRepository;
import br.com.autoflex.service.CompositionService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;


import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CompositionServiceImpl implements CompositionService {

    @Inject
    ProductRepository productRepo;
    @Inject
    RawMaterialRepository rawMaterialRepo;
    @Inject
    CompositionRepository compositionRepo;
    @Inject
    CompositionMapper mapper;
    @Inject
    EntityManager em;

    @Override
    public List<CompositionDTO> getCompositionsByProduct(Long productId) {
        Product product = productRepo.findByIdOptional(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        
        return product.composition.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CompositionDTO addComposition(Long productId, CompositionDTO dto) {
        Product product = productRepo.findByIdOptional(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepo.findByIdOptional(dto.rawMaterialId())
                .orElseThrow(() -> new NotFoundException("Raw Material not found"));

        CompositionID id = new CompositionID(productId, rawMaterial.id);
        if (compositionRepo.findByIdOptional(id).isPresent()) {
            throw new IllegalArgumentException(
                    "This raw material is already linked to this product. Use PUT to update.");
        }

        CompositionProduct composition = CompositionProduct.create(product, rawMaterial, dto.quantity());
        compositionRepo.persist(composition);

        return mapper.toDTO(composition);
    }

    @Override
    @Transactional
    public CompositionDTO updateComposition(Long productId, Long rawMaterialId, CompositionDTO dto) {
        CompositionID id = new CompositionID(productId, rawMaterialId);

        CompositionProduct composition = compositionRepo.findByIdOptional(id)
                .orElseThrow(
                        () -> new NotFoundException("Association not found between this product and raw material"));
        composition.necessaryMaterial = dto.quantity();

        compositionRepo.persist(composition);

        return mapper.toDTO(composition);
    }

    @Override
    @Transactional
    public void removeComposition(Long productId, Long rawMaterialId) {
        CompositionID id = new CompositionID(productId, rawMaterialId);

        CompositionProduct composition = compositionRepo.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Association not found"));

        // Remove from product's composition list to maintain bidirectional relationship
        if (composition.product != null && composition.product.composition != null) {
            composition.product.composition.remove(composition);
        }

        compositionRepo.delete(composition);
        em.flush();
        em.clear();
    }
}