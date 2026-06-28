import { motion } from "framer-motion";
import { DollarSign, Percent, Calendar, Calculator } from "lucide-react";

function SliderGroup({ label, icon: Icon, value, min, max, step, unit, onChange, format }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Icon size={16} className="text-accent" />
          <span>{label}</span>
        </div>
        <motion.div
          key={value}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative"
        >
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v >= min && v <= max) onChange(v);
            }}
            className="w-28 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-right text-sm font-medium text-white outline-none focus:border-accent/50 focus:bg-white/8 focus:ring-1 focus:ring-accent/20 transition-all duration-300"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 pointer-events-none">
            {unit}
          </span>
        </motion.div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-white/20 mt-1">
          <span>{format ? format(min) : min}</span>
          <span>{format ? format(max) : max}</span>
        </div>
      </div>
    </div>
  );
}

export default function CalculatorForm({
  principal,
  rate,
  term,
  onPrincipalChange,
  onRateChange,
  onTermChange,
  onCalculate,
  loading,
}) {
  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Calculator size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="font-semibold text-lg tracking-tight">
            Loan Details
          </h2>
          <p className="text-xs text-white/40">
            Adjust the sliders or type directly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SliderGroup
          label="Principal"
          icon={DollarSign}
          value={principal}
          min={1000}
          max={1000000}
          step={1000}
          unit="$"
          onChange={onPrincipalChange}
          format={(v) => (v >= 1000000 ? `${v / 1000000}M` : v >= 1000 ? `${v / 1000}k` : v)}
        />
        <SliderGroup
          label="Interest Rate"
          icon={Percent}
          value={rate}
          min={0.1}
          max={30}
          step={0.1}
          unit="%"
          onChange={onRateChange}
        />
        <SliderGroup
          label="Term"
          icon={Calendar}
          value={term}
          min={1}
          max={40}
          step={1}
          unit="yr"
          onChange={onTermChange}
        />
      </div>

      <motion.button
        onClick={onCalculate}
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 w-full py-4 rounded-2xl bg-accent text-white font-semibold text-base tracking-tight border border-accent/30 shadow-lg shadow-accent/15 hover:shadow-xl hover:shadow-accent/25 active:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator size={18} />
            Calculate Amortization
          </>
        )}
      </motion.button>
    </div>
  );
}
