import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, Table2 } from "lucide-react";
import CalculatorForm from "./components/CalculatorForm.jsx";
import MetricSummary from "./components/MetricSummary.jsx";
import AmortizationChart from "./components/AmortizationChart.jsx";
import ScheduleTable from "./components/ScheduleTable.jsx";

const API_URL = "http://localhost:8080/api/v1/amortization/calculate";

function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full bg-blue-500/8 blur-[140px]" />
      <div className="absolute -bottom-60 left-1/4 w-[550px] h-[550px] rounded-full bg-violet-500/10 blur-[130px]" />
    </div>
  );
}

function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-white/10 text-white border border-white/15 shadow-lg shadow-accent/5"
          : "text-white/40 hover:text-white/70 border border-transparent"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default function App() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("chart");

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principal: Number(principal),
          annualInterestRate: Number(rate),
          termInYears: Number(term),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.errors?.[0] || body?.error || `Server error (${res.status})`
        );
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [principal, rate, term]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <BackgroundBlobs />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-accent" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Amortization<span className="text-accent">.</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <CalculatorForm
            principal={principal}
            rate={rate}
            term={term}
            onPrincipalChange={setPrincipal}
            onRateChange={setRate}
            onTermChange={setTerm}
            onCalculate={handleCalculate}
            loading={loading}
          />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-2xl skeleton" />
                ))}
              </div>
              <div className="h-80 rounded-2xl skeleton" />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-6"
            >
              <MetricSummary
                monthlyPayment={result.monthlyPayment}
                totalInterest={result.totalInterestPaid}
                totalCost={result.totalCost}
              />

              {/* Tabs */}
              <div className="flex gap-3">
                <TabButton
                  active={activeTab === "chart"}
                  icon={TrendingUp}
                  label="Chart"
                  onClick={() => setActiveTab("chart")}
                />
                <TabButton
                  active={activeTab === "table"}
                  icon={Table2}
                  label="Schedule"
                  onClick={() => setActiveTab("table")}
                />
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "chart" && (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <AmortizationChart
                      schedule={result.schedule}
                      principal={principal}
                    />
                  </motion.div>
                )}
                {activeTab === "table" && (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ScheduleTable schedule={result.schedule} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-white/20"
          >
            <Calculator size={48} className="mb-4" />
            <p className="text-sm font-medium">
              Adjust the inputs above and click Calculate
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
