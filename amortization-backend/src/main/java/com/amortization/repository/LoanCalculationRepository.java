package com.amortization.repository;

import com.amortization.entity.LoanCalculation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanCalculationRepository extends JpaRepository<LoanCalculation, Long> {
    List<LoanCalculation> findAllByOrderByCreatedAtDesc();
}
