import { Download, FileJson, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { DroneTarget } from "../types/api";
import { formatCoordinate, formatDate, formatNumber } from "../utils/formatters";
import { EmptyState } from "./EmptyState";

interface DroneTargetsTableProps {
  targets: DroneTarget[];
}

function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string | number): string {
  const valueText = String(value);
  return `"${valueText.replace(/"/g, '""')}"`;
}

function toCsv(targets: DroneTarget[]): string {
  const headers = ["id", "latitude", "longitude", "risk_score", "risk_level", "date", "reason", "recommended_action"];
  const rows = targets.map((target) => headers.map((header) => csvCell(target[header as keyof DroneTarget])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function toGeoJson(targets: DroneTarget[]): string {
  const featureCollection = {
    type: "FeatureCollection" as const,
    features: targets.map((target) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [target.longitude, target.latitude] },
      properties: {
        id: target.id,
        date: target.date,
        risk_score: target.risk_score,
        risk_level: target.risk_level,
        reason: target.reason,
        recommended_action: target.recommended_action,
      },
    })),
  };
  return JSON.stringify(featureCollection, null, 2);
}

export function DroneTargetsTable({ targets }: DroneTargetsTableProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<"all" | "high">("all");
  const filteredTargets = useMemo(() => targets.filter((target) => {
    const searchable = `${target.id} ${target.reason} ${target.recommended_action}`.toLowerCase();
    return searchable.includes(search.trim().toLowerCase()) && (level === "all" || target.risk_level === level);
  }).sort((first, second) => second.risk_score - first.risk_score), [level, search, targets]);

  if (!targets.length) return <EmptyState title="No high-risk targets" description="No inspection targets are available in the current synthetic dataset." />;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="flex flex-col gap-4 border-b border-slate-800 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div><h2 className="font-semibold text-white">Inspection targets</h2><p className="mt-1 text-xs text-slate-400">Sorted by highest rule-based risk score.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative"><span className="sr-only">Search targets</span><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID or reason" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
          <label><span className="sr-only">Filter by risk level</span><select value={level} onChange={(event) => setLevel(event.target.value as "all" | "high")} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"><option value="all">All risk levels</option><option value="high">High risk</option></select></label>
          <button type="button" onClick={() => downloadFile(toCsv(filteredTargets), "drought-drone-targets.csv", "text/csv;charset=utf-8")} disabled={!filteredTargets.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600 px-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-300"><Download className="h-4 w-4" aria-hidden="true" />Export CSV</button>
          <button type="button" onClick={() => downloadFile(toGeoJson(filteredTargets), "drought-drone-targets.geojson", "application/geo+json;charset=utf-8")} disabled={!filteredTargets.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-100"><FileJson className="h-4 w-4" aria-hidden="true" />Export GeoJSON</button>
        </div>
      </div>
      {filteredTargets.length ? <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Latitude</th><th className="px-5 py-3">Longitude</th><th className="px-5 py-3">Risk score</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Reason</th><th className="px-5 py-3">Recommended action</th></tr></thead><tbody className="divide-y divide-slate-800">{filteredTargets.map((target) => <tr key={target.id} className="align-top text-slate-300"><td className="px-5 py-4 font-medium text-white">{target.id}</td><td className="px-5 py-4">{formatCoordinate(target.latitude)}</td><td className="px-5 py-4">{formatCoordinate(target.longitude)}</td><td className="px-5 py-4 font-semibold text-rose-200">{formatNumber(target.risk_score)}</td><td className="px-5 py-4 whitespace-nowrap">{formatDate(target.date)}</td><td className="max-w-xs px-5 py-4 leading-5">{target.reason}</td><td className="max-w-sm px-5 py-4 leading-5 text-slate-400">{target.recommended_action}</td></tr>)}</tbody></table></div> : <div className="p-5"><EmptyState title="No matching targets" description="Adjust the search or risk-level filter to see available targets." /></div>}
    </section>
  );
}
