package com.amortization.dto;

import java.math.BigDecimal;

public record MonthlyBreakdown(
        int monthNumber,
        BigDecimal principalPaid,
        BigDecimal interestPaid,
        BigDecimal remainingBalance
) {}
