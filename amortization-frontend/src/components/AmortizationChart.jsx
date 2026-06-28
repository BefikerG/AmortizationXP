import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

const formatUSD = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
  }).format(v);

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-xs space-y-1.5">
      <p className="text-white/40 font-medium">Month {label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-white/60">{entry.name}:</span>
          <span className="text-white font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            }).format(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AmortizationChart({ schedule, principal }) {
  const chartData = useMemo(
    () =>
      schedule.map((m) => ({
        month: m.monthNumber,
        Balance: m.remainingBalance,
        PrincipalPaid: m.principalPaid,
        InterestPaid: m.interestPaid,
      })),
    [schedule]
  );

  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <TrendingUp size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-base tracking-tight">
            Balance Over Time
          </h3>
          <p className="text-xs text-white/40">
            Remaining principal across the loan term
          </p>
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6c5ce7" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6c5ce7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatUSD}
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="Balance"
              stroke="#6c5ce7"
              strokeWidth={2}
              fill="url(#balanceGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#6c5ce7", stroke: "#0a0a0a", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="PrincipalPaid"
              stroke="#a78bfa"
              strokeWidth={1.5}
              fill="url(#principalGrad)"
              dot={false}
              activeDot={{ r: 3, fill: "#a78bfa", stroke: "#0a0a0a", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="InterestPaid"
              stroke="#f472b6"
              strokeWidth={1.5}
              fill="url(#interestGrad)"
              dot={false}
              activeDot={{ r: 3, fill: "#f472b6", stroke: "#0a0a0a", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
