import { Activity, MapPinned, ScanSearch, ShieldAlert } from "lucide-react";

import type { RiskSummary } from "../types/api";
import { formatPercent } from "../utils/formatters";

interface MetricsCardsProps {
  summary: RiskSummary;
}

const distribution = [
  { label: "Low", key: "low_count", color: "bg-emerald-400" },
  { label: "Medium", key: "medium_count", color: "bg-amber-400" },
  { label: "High", key: "high_count", color: "bg-rose-400" },
] as const;

export function MetricsCards({ summary }: MetricsCardsProps) {
  const cards = [
    { label: "Total observations", value: summary.total_observations.toString(), note: "Synthetic records loaded", icon: MapPinned, tone: "text-cyan-200" },
    { label: "Average risk score", value: formatPercent(summary.average_risk_score), note: "Rule-based baseline", icon: Activity, tone: "text-violet-200" },
    { label: "High-risk zones", value: summary.high_count.toString(), note: "Review candidates", icon: ShieldAlert, tone: "text-rose-200" },
  ];

  return (
    <section aria-label="Risk overview metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, note, icon: Icon, tone }) => (
        <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-start justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" /></div>
          <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </article>
      ))}
      <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex items-center justify-between"><p className="text-sm text-slate-400">Risk distribution</p><ScanSearch className="h-5 w-5 text-amber-200" aria-hidden="true" /></div>
        <div className="mt-5 flex gap-4">
          {distribution.map(({ label, key, color }) => (
            <div key={key}><p className="text-xl font-semibold text-white">{summary[key]}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />{label}</p></div>
          ))}
        </div>
      </article>
    </section>
  );
}
