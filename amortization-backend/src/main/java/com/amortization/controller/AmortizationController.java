package com.amortization.controller;

import com.amortization.dto.AmortizationRequest;
import com.amortization.dto.AmortizationResponse;
import com.amortization.service.AmortizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/amortization")
public class AmortizationController {

    private final AmortizationService service;

    public AmortizationController(AmortizationService service) {
        this.service = service;
    }

    @PostMapping("/calculate")
    public ResponseEntity<AmortizationResponse> calculate(@Valid @RequestBody AmortizationRequest request) {
        AmortizationResponse response = service.calculate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
