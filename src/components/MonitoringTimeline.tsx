import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DataQuality, MonitoringObservation, TimelineResponse } from "../types/api";
import { formatDate, formatNumber, formatPercent } from "../utils/formatters";

interface MonitoringTimelineProps { timeline: TimelineResponse | null; isLoading: boolean; }

const chartTooltip = { background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" };
const riskLabels = { low: "Низкий", medium: "Средний", high: "Высокий", critical: "Критический" } as const;
const qualityLabels: Record<DataQuality, string> = { segmentation_only: "Только сегментация", partial: "Частичные данные", complete: "Полные данные" };
const qualityStyles: Record<DataQuality, string> = { segmentation_only: "border-slate-600 bg-slate-800 text-slate-300", partial: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100", complete: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" };

interface ChartPoint {
  date: string;
  risk: number;
  drought: number;
  precipitationAnomaly: number | null;
  temperatureAnomaly: number | null;
  ndvi: number | null;
  ndviBaseline: number | null;
  ndmi: number | null;
  ndviAnomaly: number | null;
  vegetationStress: number | null;
  riskLevel: MonitoringObservation["risk_level"];
  quality: DataQuality;
}

function ObservationRow({ observation }: { observation: MonitoringObservation }) {
  return <div className="flex items-center justify-between gap-3 border-t border-slate-800 py-3 text-sm"><div><p className="font-medium text-slate-100">{formatDate(observation.observed_at)}</p><p className="mt-1 text-xs text-slate-500">{observation.explanation}</p></div><div className="text-right"><p className="font-semibold text-slate-200">{riskLabels[observation.risk_level]}</p><p className="text-xs text-slate-400">{formatPercent(observation.risk_score)} риск</p></div></div>;
}

function QualityBadge({ quality }: { quality: DataQuality }) {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${qualityStyles[quality]}`}>{qualityLabels[quality]}</span>;
}

function valueOrDash(value: number | null, suffix = "") {
  return value === null ? "—" : `${formatNumber(value)}${suffix}`;
}

function TimelineTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: ChartPoint }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return <div className="min-w-56 space-y-2 rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 shadow-xl"><div className="flex items-center justify-between gap-3"><strong className="text-sm text-white">{label}</strong><QualityBadge quality={point.quality} /></div><dl className="space-y-1"><div className="flex justify-between gap-4"><dt>Риск</dt><dd className="font-semibold text-orange-300">{formatPercent(point.risk / 100)}</dd></div><div className="flex justify-between gap-4"><dt>Уровень</dt><dd>{riskLabels[point.riskLevel]}</dd></div><div className="flex justify-between gap-4"><dt>Доля засухи</dt><dd>{formatPercent(point.drought / 100)}</dd></div><div className="flex justify-between gap-4"><dt>Аномалия осадков</dt><dd>{valueOrDash(point.precipitationAnomaly)}</dd></div><div className="flex justify-between gap-4"><dt>Аномалия температуры</dt><dd>{valueOrDash(point.temperatureAnomaly, " °C")}</dd></div><div className="flex justify-between gap-4"><dt>NDVI</dt><dd>{valueOrDash(point.ndvi)}</dd></div><div className="flex justify-between gap-4"><dt>NDMI</dt><dd>{valueOrDash(point.ndmi)}</dd></div><div className="flex justify-between gap-4"><dt>Аномалия NDVI</dt><dd>{valueOrDash(point.ndviAnomaly)}</dd></div><div className="flex justify-between gap-4"><dt>Стресс растительности</dt><dd>{point.vegetationStress === null ? "—" : formatPercent(point.vegetationStress)}</dd></div></dl></div>;
}

export function MonitoringTimeline({ timeline, isLoading }: MonitoringTimelineProps) {
  const [selectedObservation, setSelectedObservation] = useState<MonitoringObservation | null>(null);
  useEffect(() => { setSelectedObservation(timeline?.observations.at(-1) ?? null); }, [timeline]);

  if (isLoading) return <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5" role="status">Загружаем историю наблюдений…</section>;
  if (!timeline || timeline.observations.length < 2) return <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6"><h2 className="font-semibold text-white">История и тренд</h2><p className="mt-2 text-sm text-slate-400">Анализируйте ещё один месяц, чтобы увидеть тренд риска засухи.</p>{timeline?.observations.map((observation) => <ObservationRow key={observation.id} observation={observation} />)}</section>;

  const data: ChartPoint[] = timeline.observations.map((observation) => ({ date: formatDate(observation.observed_at), risk: Number((observation.risk_score * 100).toFixed(1)), drought: Number((observation.drought_fraction * 100).toFixed(1)), precipitationAnomaly: observation.precipitation_anomaly, temperatureAnomaly: observation.temperature_anomaly, ndvi: observation.ndvi, ndviBaseline: observation.ndvi_baseline, ndmi: observation.ndmi, ndviAnomaly: observation.ndvi_anomaly, vegetationStress: observation.vegetation_stress, riskLevel: observation.risk_level, quality: observation.data_quality }));
  const summary = timeline.summary;
  const selectPoint = (index: number | string | undefined) => { if (typeof index === "number") setSelectedObservation(timeline.observations[index]); };

  return <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/75 p-5" aria-labelledby="timeline-title"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 id="timeline-title" className="font-semibold text-white">История и тренд</h2><p className="mt-1 text-xs text-slate-400">Реальные наблюдения, сохранённые для выбранной точки.</p></div><div className="grid grid-cols-2 gap-x-5 gap-y-2 text-xs text-slate-400"><span>Наблюдений <strong className="text-white">{summary.observation_count}</strong></span><span>Тренд <strong className="text-white">{summary.trend}</strong></span><span>Изменение риска <strong className="text-white">{summary.risk_score_change === null ? "—" : formatPercent(summary.risk_score_change)}</strong></span><span>Изменение доли <strong className="text-white">{summary.drought_fraction_change === null ? "—" : formatPercent(summary.drought_fraction_change)}</strong></span></div></div><div className="grid gap-5 lg:grid-cols-2"><div><h3 className="mb-2 text-sm font-medium text-slate-200">Риск и погодные аномалии</h3><p className="mb-2 text-xs text-slate-500">Риск — %, аномалии — доля для осадков и °C для температуры.</p><div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} onMouseMove={(state) => selectPoint(state.activeTooltipIndex)} onClick={(state) => selectPoint(state.activeTooltipIndex)}><CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis yAxisId="risk" domain={[0, 100]} stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis yAxisId="anomaly" orientation="right" stroke="#67e8f9" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><Tooltip content={<TimelineTooltip />} /><Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} /><Line yAxisId="risk" type="monotone" dataKey="risk" name="Риск, %" stroke="#fb923c" strokeWidth={3} dot={{ r: 4, fill: "#fb923c" }} connectNulls={false} /><Line yAxisId="anomaly" type="monotone" dataKey="precipitationAnomaly" name="Аномалия осадков" stroke="#67e8f9" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "#67e8f9" }} connectNulls={false} /><Line yAxisId="anomaly" type="monotone" dataKey="temperatureAnomaly" name="Аномалия температуры, °C" stroke="#c084fc" strokeWidth={2} strokeDasharray="2 3" dot={{ r: 4, fill: "#c084fc" }} connectNulls={false} /></LineChart></ResponsiveContainer></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-500" />Только сегментация</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-300" />Частичные данные</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-300" />Полные данные</span></div></div><div><h3 className="mb-2 text-sm font-medium text-slate-200">Доля зон с признаками засухи, %</h3><div className="h-56"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><Tooltip contentStyle={chartTooltip} formatter={(value) => [`${value}%`, "Доля зон"]} /><Area type="monotone" dataKey="drought" name="Доля зон" stroke="#f87171" fill="#f87171" fillOpacity={0.2} /></AreaChart></ResponsiveContainer></div></div></div><div><h3 className="mb-2 text-sm font-medium text-slate-200">Динамика NDVI</h3><p className="mb-2 text-xs text-slate-500">Локальная эмпирическая историческая база, не официальная норма.</p><div className="h-52"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} onMouseMove={(state) => selectPoint(state.activeTooltipIndex)} onClick={(state) => selectPoint(state.activeTooltipIndex)}><CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis domain={[-1, 1]} stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><Tooltip content={<TimelineTooltip />} /><Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} /><Line type="monotone" dataKey="ndvi" name="NDVI" stroke="#4ade80" strokeWidth={2} dot={{ r: 4, fill: "#4ade80" }} connectNulls={false} /><Line type="monotone" dataKey="ndviBaseline" name="NDVI baseline" stroke="#a3e635" strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false} /></LineChart></ResponsiveContainer></div></div>{selectedObservation ? <section className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4" aria-live="polite"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs uppercase tracking-[0.14em] text-slate-400">Выбранный месяц</p><h3 className="mt-1 font-semibold text-white">{formatDate(selectedObservation.observed_at)}</h3></div><QualityBadge quality={selectedObservation.data_quality} /></div><p className="mt-3 text-sm leading-6 text-slate-300">{selectedObservation.explanation}</p></section> : null}<div>{timeline.observations.slice().reverse().map((observation) => <ObservationRow key={observation.id} observation={observation} />)}</div></section>;
}
