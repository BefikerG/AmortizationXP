package com.amortization.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AmortizationRequest(
        @NotNull(message = "Principal is required")
        @DecimalMin(value = "0.01", message = "Principal must be greater than 0")
        BigDecimal principal,

        @NotNull(message = "Annual interest rate is required")
        @DecimalMin(value = "0.00", inclusive = false, message = "Annual interest rate must be greater than 0")
        @DecimalMax(value = "100.00", message = "Annual interest rate must not exceed 100")
        BigDecimal annualInterestRate,

        @NotNull(message = "Term in years is required")
        @DecimalMin(value = "1", message = "Term must be at least 1 year")
        Integer termInYears
) {}
