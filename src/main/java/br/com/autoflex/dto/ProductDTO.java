package br.com.autoflex.dto;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ProductDTO(
        @Schema(readOnly = true, example = "1")
        Long id,

        @NotBlank(message = "Name is required")
        @Schema(description = "Comercial product name", example = "Mayo", required = true)
        String name,

        @NotNull(message = "Value is required")
        @Positive(message = "Value must be positive")
        @Schema(description = "Unit selling price", example = "12.50", required = true)
        BigDecimal value
) {}