import { motion } from "framer-motion";
import { DollarSign, PiggyBank, Receipt } from "lucide-react";

const formatUSD = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

function MetricCard({ icon: Icon, label, value, accent, dominant }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`rounded-2xl backdrop-blur-xl border ${
        dominant
          ? "bg-accent/[0.07] border-accent/20 col-span-1 md:col-span-1"
          : "bg-white/[0.03] border-white/[0.06]"
      } p-6 flex flex-col justify-center`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          size={dominant ? 20 : 16}
          className={accent ? "text-accent" : "text-white/40"}
        />
        <span
          className={`${
            dominant ? "text-sm" : "text-xs"
          } font-medium text-white/50 uppercase tracking-wider`}
        >
          {label}
        </span>
      </div>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          dominant ? "text-4xl md:text-5xl" : "text-2xl"
        } font-semibold tracking-tight text-white`}
      >
        {formatUSD(value)}
      </motion.span>
    </motion.div>
  );
}

export default function MetricSummary({ monthlyPayment, totalInterest, totalCost }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        icon={DollarSign}
        label="Monthly Payment"
        value={monthlyPayment}
        accent
        dominant
      />
      <MetricCard
        icon={PiggyBank}
        label="Total Interest"
        value={totalInterest}
      />
      <MetricCard
        icon={Receipt}
        label="Total Cost"
        value={totalCost}
      />
    </div>
  );
}
