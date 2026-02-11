package br.com.autoflex.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record RawMaterialDTO(
        @Schema(readOnly = true, example = "10")
        Long id,

        @NotBlank(message = "Name is required")
        @Schema(description = "Name of the raw material", example = "Steel Sheet", required = true)
        String name,

        @Min(value = 0, message = "Quantity cannot be negative")
        @Schema(description = "Current stock quantity", example = "150", required = true)
        int quantity
) {}