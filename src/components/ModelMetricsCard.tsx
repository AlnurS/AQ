import { BrainCircuit, CheckCircle2, CircleDashed } from "lucide-react";

import type { ModelMetrics } from "../types/api";
import { formatPercent } from "../utils/formatters";
import { DemoDataNotice } from "./DemoDataNotice";

interface ModelMetricsCardProps {
  metrics: ModelMetrics;
}

export function ModelMetricsCard({ metrics }: ModelMetricsCardProps) {
  const trained = metrics.status === "trained";
  const values = [
    ["Accuracy", metrics.accuracy], ["Precision", metrics.precision], ["Recall", metrics.recall], ["F1 score", metrics.f1],
  ] as const;
  return (<><DemoDataNotice />
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold text-white">Model status</h2><p className="mt-1 text-sm text-slate-400">Local Random Forest classifier</p></div><BrainCircuit className="h-6 w-6 text-violet-200" aria-hidden="true" /></div><div className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${trained ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-amber-400/30 bg-amber-400/10 text-amber-100"}`}>{trained ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <CircleDashed className="h-4 w-4" aria-hidden="true" />}{trained ? "Trained" : "Not trained"}</div>{trained ? <><div className="mt-5 grid grid-cols-2 gap-3">{values.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-950 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-xl font-semibold text-white">{value === null ? "—" : formatPercent(value)}</p></div>)}</div><p className="mt-4 text-xs text-slate-500">Training rows: {metrics.training_rows ?? "—"}. Metrics are from synthetic held-out data.</p></> : <p className="mt-5 text-sm leading-6 text-slate-400">Train the local model to create performance metrics and enable indicator-based predictions.</p>}</section>
  </>);
}
