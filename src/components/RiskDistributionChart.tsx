import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { RiskSummary } from "../types/api";
import { RISK_COLORS } from "../utils/risk";

interface RiskDistributionChartProps {
  summary: RiskSummary;
}

export function RiskDistributionChart({ summary }: RiskDistributionChartProps) {
  const data = [
    { name: "Low", count: summary.low_count, fill: RISK_COLORS.low },
    { name: "Medium", count: summary.medium_count, fill: RISK_COLORS.medium },
    { name: "High", count: summary.high_count, fill: RISK_COLORS.high },
  ];
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="font-semibold text-white">Risk distribution</h2><p className="mt-1 text-xs text-slate-400">Number of observations in each baseline risk band</p>
      <div className="mt-5 h-64" role="img" aria-label="Bar chart showing counts of low, medium, and high drought-risk observations">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: "#1e293b" }} contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} labelStyle={{ color: "#e2e8f0" }} itemStyle={{ color: "#e2e8f0" }} /><Bar dataKey="count" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
      </div>
    </section>
  );
}
