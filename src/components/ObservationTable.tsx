import type { Observation } from "../types/api";
import { formatCoordinate, formatDate, formatNumber } from "../utils/formatters";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

interface ObservationTableProps {
  observations: Observation[];
}

export function ObservationTable({ observations }: ObservationTableProps) {
  if (!observations.length) return <EmptyState title="No observations available" description="The local dataset did not return any risk observations." />;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"><div className="border-b border-slate-800 px-5 py-4"><h2 className="font-semibold text-white">Recent observations</h2><p className="mt-1 text-xs text-slate-400">Map data is also available here as an accessible sortable record list.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Coordinates</th><th className="px-5 py-3">NDVI</th><th className="px-5 py-3">Temperature</th><th className="px-5 py-3">Risk score</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-800">{observations.slice(0, 10).map((observation) => <tr key={observation.id} className="text-slate-300"><td className="px-5 py-3 font-medium text-white">{observation.id}</td><td className="px-5 py-3">{formatDate(observation.date)}</td><td className="px-5 py-3 text-slate-400">{formatCoordinate(observation.latitude)}, {formatCoordinate(observation.longitude)}</td><td className="px-5 py-3">{formatNumber(observation.ndvi)}</td><td className="px-5 py-3">{formatNumber(observation.temperature_c)} °C</td><td className="px-5 py-3">{formatNumber(observation.risk_score)}</td><td className="px-5 py-3"><StatusBadge level={observation.risk_level} /></td></tr>)}</tbody></table></div></section>
  );
}
