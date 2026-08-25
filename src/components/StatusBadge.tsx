import type { RiskLevel } from "../types/api";
import { RISK_LABELS } from "../utils/risk";

interface StatusBadgeProps {
  level: RiskLevel;
}

const styles: Record<RiskLevel, string> = {
  low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  medium: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  high: "border-rose-400/30 bg-rose-400/10 text-rose-100",
};

export function StatusBadge({ level }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[level]}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {RISK_LABELS[level]} risk
    </span>
  );
}
