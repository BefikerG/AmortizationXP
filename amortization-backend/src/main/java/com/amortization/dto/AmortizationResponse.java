package com.amortization.dto;

import java.math.BigDecimal;
import java.util.List;

public record AmortizationResponse(
        BigDecimal monthlyPayment,
        BigDecimal totalInterestPaid,
        BigDecimal totalCost,
        List<MonthlyBreakdown> schedule
) {}
