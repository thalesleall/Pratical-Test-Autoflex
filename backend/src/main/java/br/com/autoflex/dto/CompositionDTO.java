package br.com.autoflex.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record CompositionDTO(
        @NotNull(message = "Raw Material ID is required")
        @Schema(description = "ID of the raw material to link", example = "10")
        Long rawMaterialId,

        @Schema(readOnly = true, description = "Name of the raw material (Output only)", example = "Steel Sheet")
        String rawMaterialName,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        @Schema(description = "Amount of material required for one unit of product", example = "2.5")
        Double quantity
) {}