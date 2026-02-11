package br.com.autoflex.service.impl;

import br.com.autoflex.dto.ProductionSuggestionDTO;
import br.com.autoflex.model.CompositionProduct;
import br.com.autoflex.model.Product;
import br.com.autoflex.model.RawMaterial;
import br.com.autoflex.repository.ProductRepository;
import br.com.autoflex.repository.RawMaterialRepository;
import br.com.autoflex.service.ProductionService;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionServiceImpl implements ProductionService {

    @Inject
    ProductRepository productRepo;

    @Inject
    RawMaterialRepository rawMaterialRepo;

    @Override
    public List<ProductionSuggestionDTO> getProductionSuggestion() {
        Map<Long, Double> stockSimulation = new HashMap<>();
        List<RawMaterial> allMaterials = rawMaterialRepo.listAll();

        for (RawMaterial rm : allMaterials) {
            stockSimulation.put(rm.id, (double) rm.quantity);
        }

        List<Product> sortedProducts = productRepo.listAll(Sort.descending("value"));

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        for (Product product : sortedProducts) {


            if (product.composition == null || product.composition.isEmpty()) {
                continue;
            }


            int maxProducible = Integer.MAX_VALUE;

            for (CompositionProduct item : product.composition) {
                Long materialId = item.rawMaterial.id;
                Double requiredPerUnit = item.necessaryMaterial;


                Double availableInStock = stockSimulation.getOrDefault(materialId, 0.0);

                if (availableInStock < requiredPerUnit) {
                    maxProducible = 0;
                    break;
                }

                int possibleWithThisMaterial = (int) (availableInStock / requiredPerUnit);

                maxProducible = Math.min(maxProducible, possibleWithThisMaterial);
            }

            if (maxProducible > 0) {

                BigDecimal totalValue = product.value.multiply(new BigDecimal(maxProducible));

                suggestions.add(new ProductionSuggestionDTO(
                        product.name,
                        maxProducible,
                        product.value,
                        totalValue
                ));

                for (CompositionProduct item : product.composition) {
                    Long materialId = item.rawMaterial.id;
                    Double totalRequired = item.necessaryMaterial * maxProducible;

                    Double currentStock = stockSimulation.get(materialId);
                    stockSimulation.put(materialId, currentStock - totalRequired);
                }
            }
        }

        return suggestions;
    }
}