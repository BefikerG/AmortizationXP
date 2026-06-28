# Amortization Schedule Calculator

A full-stack loan amortization calculator with a Spring Boot backend and a React frontend featuring a premium glassmorphic UI.

## Architecture

```
amortization-backend/     — Spring Boot 3.x + PostgreSQL
amortization-frontend/    — React + Vite + Tailwind CSS v4
```

### Backend
- **Framework:** Spring Boot 3.4.4 (Java 21)
- **Build:** Maven
- **Database:** PostgreSQL 16 (via Docker Compose)
- **API:** `POST /api/v1/amortization/calculate`
- **Persistence:** JPA entity (`LoanCalculation`) saves every calculation with a timestamp

### Frontend
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4 with glassmorphic design system
- **Animation:** Framer Motion
- **Charts:** Recharts (area chart with 3 series)
- **Icons:** Lucide React

## Quick Start

### Prerequisites
- Java 21+
- Node.js 20+
- Docker (for PostgreSQL)

### 1. Start PostgreSQL

```bash
cd amortization-backend
docker compose up -d
```

### 2. Start the Backend

```bash
cd amortization-backend
mvn spring-boot:run
```

The API is available at `http://localhost:8080`.

### 3. Start the Frontend

```bash
cd amortization-frontend
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

## API Reference

### `POST /api/v1/amortization/calculate`

**Request body:**

```json
{
  "principal": 300000,
  "annualInterestRate": 6.5,
  "termInYears": 30
}
```

**Response body:**

```json
{
  "monthlyPayment": 1896.20,
  "totalInterestPaid": 382633.47,
  "totalCost": 682633.47,
  "schedule": [
    {
      "monthNumber": 1,
      "principalPaid": 271.20,
      "interestPaid": 1625.00,
      "remainingBalance": 299728.80
    }
  ]
}
```

### Validation rules

| Field              | Rule                              |
|--------------------|-----------------------------------|
| `principal`        | > 0                               |
| `annualInterestRate` | > 0 and ≤ 100                   |
| `termInYears`      | ≥ 1                               |

Validation errors return `400` with a structured error object.

## Design System (Frontend)

- **Canvas:** Deep obsidian (`#0a0a0a`) with soft radial gradient blobs
- **Panels:** Glassmorphic (`backdrop-blur-2xl`, `bg-white/[0.03]`, fine borders)
- **Micro-interactions:** Buttons scale on click, inputs glow on focus, sliders have custom thumbs with glow
- **Loading state:** Shimmer skeleton animation during API calls
- **Empty state:** Subtle prompt when no calculation has been run
- **Error state:** Styled red banner with server error messages

## Project Structure

```
amortization-backend/
├── docker-compose.yml
├── pom.xml
├── README.md
└── src/main/java/com/amortization/
    ├── AmortizationApplication.java
    ├── config/CorsConfig.java
    ├── controller/
    │   ├── AmortizationController.java
    │   └── GlobalExceptionHandler.java
    ├── dto/
    │   ├── AmortizationRequest.java
    │   ├── AmortizationResponse.java
    │   └── MonthlyBreakdown.java
    ├── entity/LoanCalculation.java
    ├── repository/LoanCalculationRepository.java
    └── service/AmortizationService.java

amortization-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    └── components/
        ├── CalculatorForm.jsx
        ├── MetricSummary.jsx
        ├── AmortizationChart.jsx
        └── ScheduleTable.jsx
```
