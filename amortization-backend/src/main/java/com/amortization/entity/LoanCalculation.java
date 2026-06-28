package com.amortization.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_calculations")
public class LoanCalculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal principal;

    @Column(name = "annual_interest_rate", nullable = false, precision = 8, scale = 4)
    private BigDecimal annualInterestRate;

    @Column(name = "term_in_years", nullable = false)
    private Integer termInYears;

    @Column(name = "monthly_payment", nullable = false, precision = 19, scale = 4)
    private BigDecimal monthlyPayment;

    @Column(name = "total_interest_paid", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalInterestPaid;

    @Column(name = "total_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalCost;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public LoanCalculation() {}

    public LoanCalculation(BigDecimal principal, BigDecimal annualInterestRate, Integer termInYears,
                           BigDecimal monthlyPayment, BigDecimal totalInterestPaid, BigDecimal totalCost) {
        this.principal = principal;
        this.annualInterestRate = annualInterestRate;
        this.termInYears = termInYears;
        this.monthlyPayment = monthlyPayment;
        this.totalInterestPaid = totalInterestPaid;
        this.totalCost = totalCost;
    }

    public Long getId() { return id; }
    public BigDecimal getPrincipal() { return principal; }
    public BigDecimal getAnnualInterestRate() { return annualInterestRate; }
    public Integer getTermInYears() { return termInYears; }
    public BigDecimal getMonthlyPayment() { return monthlyPayment; }
    public BigDecimal getTotalInterestPaid() { return totalInterestPaid; }
    public BigDecimal getTotalCost() { return totalCost; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
