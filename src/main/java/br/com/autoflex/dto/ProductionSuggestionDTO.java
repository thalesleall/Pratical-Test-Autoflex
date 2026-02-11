package br.com.autoflex.dto;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import java.math.BigDecimal;

public record ProductionSuggestionDTO(
        @Schema(description = "Product Name")
        String productName,

        @Schema(description = "Quantity that can be manufactured with current stock")
        int producibleQuantity,

        @Schema(description = "Unit value of the product")
        BigDecimal unitValue,

        @Schema(description = "Total potential revenue (Quantity * Unit Value)")
        BigDecimal totalValueEstimate
) {}