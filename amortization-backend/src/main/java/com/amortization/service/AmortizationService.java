package com.amortization.service;

import com.amortization.dto.AmortizationRequest;
import com.amortization.dto.AmortizationResponse;
import com.amortization.dto.MonthlyBreakdown;
import com.amortization.entity.LoanCalculation;
import com.amortization.repository.LoanCalculationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class AmortizationService {

    private static final int SCALE = 10;
    private static final int DISPLAY_SCALE = 2;
    private static final MathContext MC = new MathContext(SCALE, RoundingMode.HALF_EVEN);
    private static final BigDecimal MONTHS_IN_YEAR = new BigDecimal("12");

    private final LoanCalculationRepository repository;

    public AmortizationService(LoanCalculationRepository repository) {
        this.repository = repository;
    }

    public AmortizationResponse calculate(AmortizationRequest request) {
        BigDecimal principal = request.principal();
        BigDecimal annualRate = request.annualInterestRate();
        int termYears = request.termInYears();
        int totalPayments = termYears * 12;

        BigDecimal monthlyRate = annualRate
                .divide(new BigDecimal("100"), MC)
                .divide(MONTHS_IN_YEAR, MC);

        BigDecimal monthlyPayment = computeMonthlyPayment(principal, monthlyRate, totalPayments);

        List<MonthlyBreakdown> schedule = buildSchedule(principal, monthlyRate, totalPayments, monthlyPayment);

        BigDecimal totalPaid = monthlyPayment.multiply(BigDecimal.valueOf(totalPayments), MC);
        BigDecimal totalInterest = totalPaid.subtract(principal, MC);

        AmortizationResponse response = new AmortizationResponse(
                monthlyPayment.setScale(DISPLAY_SCALE, RoundingMode.HALF_EVEN),
                totalInterest.setScale(DISPLAY_SCALE, RoundingMode.HALF_EVEN),
                totalPaid.setScale(DISPLAY_SCALE, RoundingMode.HALF_EVEN),
                schedule
        );

        repository.save(new LoanCalculation(
                principal, annualRate, termYears,
                response.monthlyPayment(),
                response.totalInterestPaid(),
                response.totalCost()
        ));

        return response;
    }

    private BigDecimal computeMonthlyPayment(BigDecimal principal, BigDecimal monthlyRate, int totalPayments) {
        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(BigDecimal.valueOf(totalPayments), SCALE, RoundingMode.HALF_EVEN);
        }

        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate, MC);
        BigDecimal powered = onePlusR.pow(totalPayments, MC);

        BigDecimal numerator = principal.multiply(monthlyRate, MC).multiply(powered, MC);
        BigDecimal denominator = powered.subtract(BigDecimal.ONE, MC);

        return numerator.divide(denominator, SCALE, RoundingMode.HALF_EVEN);
    }

    private List<MonthlyBreakdown> buildSchedule(BigDecimal principal, BigDecimal monthlyRate,
                                                  int totalPayments, BigDecimal monthlyPayment) {
        List<MonthlyBreakdown> schedule = new ArrayList<>(totalPayments);
        BigDecimal balance = principal;

        for (int month = 1; month <= totalPayments; month++) {
            BigDecimal interestPaid = balance.multiply(monthlyRate, MC);
            BigDecimal principalPaid = monthlyPayment.subtract(interestPaid, MC);

            if (principalPaid.compareTo(balance) > 0) {
                principalPaid = balance;
                interestPaid = monthlyPayment.subtract(principalPaid, MC);
            }

            balance = balance.subtract(principalPaid, MC);

            if (balance.compareTo(BigDecimal.ZERO) < 0) {
                balance = BigDecimal.ZERO;
            }

            MonthlyBreakdown entry = new MonthlyBreakdown(
                    month,
                    principalPaid.setScale(DISPLAY_SCALE, RoundingMode.HALF_EVEN),
                    interestPaid.setScale(DISPLAY_SCALE, RoundingMode.HALF_EVEN),
                    balance.setScale(DISPLAY_SCALE, RoundingMode.HALF_EVEN)
            );
            schedule.add(entry);
        }

        return schedule;
    }
}
