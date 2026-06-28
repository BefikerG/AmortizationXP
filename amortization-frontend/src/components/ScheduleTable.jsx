import { useMemo, useState } from "react";
import { Table2, ChevronDown } from "lucide-react";

const formatUSD = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

const ROWS_PER_PAGE = 12;

export default function ScheduleTable({ schedule }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(schedule.length / ROWS_PER_PAGE);
  const pageRows = useMemo(
    () => schedule.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE),
    [schedule, page]
  );

  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 pb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Table2 size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-base tracking-tight">
            Amortization Schedule
          </h3>
          <p className="text-xs text-white/40">
            {schedule.length} monthly payments
          </p>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <Th>Month</Th>
              <Th>Principal</Th>
              <Th>Interest</Th>
              <Th align="right">Remaining</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => {
              const idx = page * ROWS_PER_PAGE + i;
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={row.monthNumber}
                  className={`transition-colors duration-200 ${
                    isEven
                      ? "bg-white/[0.02]"
                      : "bg-transparent"
                  } hover:bg-white/[0.05]`}
                >
                  <Td>{row.monthNumber}</Td>
                  <Td>
                    <span className="text-emerald-400/90">
                      {formatUSD(row.principalPaid)}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-rose-400/90">
                      {formatUSD(row.interestPaid)}
                    </span>
                  </Td>
                  <Td align="right">
                    <span className="font-medium text-white/80">
                      {formatUSD(row.remainingBalance)}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
        <span className="text-xs text-white/30">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <PageBtn
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronDown size={14} className="rotate-90" />
          </PageBtn>
          <PageBtn
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            <ChevronDown size={14} className="-rotate-90" />
          </PageBtn>
        </div>
      </div>
    </div>
  );
}

function Th({ children, align }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-medium text-white/30 uppercase tracking-wider ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, align }) {
  return (
    <td
      className={`px-4 py-3 whitespace-nowrap ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  );
}

function PageBtn({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
    >
      {children}
    </button>
  );
}
