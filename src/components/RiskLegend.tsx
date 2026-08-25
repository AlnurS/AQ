import type { RiskLevel } from "../types/api";
import { RISK_COLORS, RISK_LABELS } from "../utils/risk";

const levels: RiskLevel[] = ["low", "medium", "high"];

export function RiskLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[500] rounded-lg border border-slate-700 bg-slate-950/95 px-3 py-2 shadow-lg" aria-label="Risk map legend">
      <p className="mb-2 text-xs font-semibold text-white">Drought risk</p>
      <div className="space-y-1.5">{levels.map((level) => <p key={level} className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[level] }} aria-hidden="true" />{RISK_LABELS[level]}</p>)}</div>
    </div>
  );
}
