import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

import { predictDrought, getModelMetrics, trainModel } from "../api/endpoints";
import { ErrorState } from "../components/ErrorState";
import { ModelMetricsCard } from "../components/ModelMetricsCard";
import { PageLoader } from "../components/PageLoader";
import type { PredictionResponse } from "../types/api";
import { formatPercent } from "../utils/formatters";
import { getRiskLevelFromScore, RISK_LABELS } from "../utils/risk";

interface IndicatorForm {
  ndvi: string;
  ndmi: string;
  temperature_c: string;
  precipitation_mm: string;
  soil_moisture: string;
}

const initialForm: IndicatorForm = { ndvi: "0.35", ndmi: "-0.05", temperature_c: "32", precipitation_mm: "3", soil_moisture: "0.15" };

export function ModelPage() {
  const queryClient = useQueryClient();
  const metricsQuery = useQuery({ queryKey: ["model-metrics"], queryFn: getModelMetrics, retry: 2 });
  const [form, setForm] = useState<IndicatorForm>(initialForm);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const trainMutation = useMutation({ mutationFn: trainModel, onSuccess: (metrics) => { queryClient.setQueryData(["model-metrics"], metrics); } });
  const predictionMutation = useMutation({ mutationFn: predictDrought, onSuccess: setPrediction });

  function submitPrediction(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setPrediction(null);
    predictionMutation.mutate({ latitude: 48, longitude: 67, date: new Date().toISOString().slice(0, 10), ndvi: Number(form.ndvi), ndmi: Number(form.ndmi), temperature_c: Number(form.temperature_c), precipitation_mm: Number(form.precipitation_mm), soil_moisture: Number(form.soil_moisture) });
  }

  if (metricsQuery.isLoading) return <PageLoader label="Checking model status…" />;
  if (metricsQuery.error) return <ErrorState message={metricsQuery.error.message} onRetry={() => { void metricsQuery.refetch(); }} />;
  if (!metricsQuery.data) return null;
  const displayLevel = prediction ? getRiskLevelFromScore(prediction.drought_probability) : null;

  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">Educational classifier</p><h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Model</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Train the local demonstration model and inspect an indicator-based classification.</p></header><div className="flex gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50" role="note"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" /><p>This MVP is trained on synthetic data. It is a software demonstration, not a validated operational drought-prediction system.</p></div><div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><ModelMetricsCard metrics={metricsQuery.data} /><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h2 className="font-semibold text-white">Training control</h2><p className="mt-1 text-sm leading-6 text-slate-400">Training stays local and overwrites the previous educational model artifact.</p><button type="button" onClick={() => trainMutation.mutate()} disabled={trainMutation.isPending} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet-300 px-4 text-sm font-semibold text-slate-950 hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-100"><Sparkles className="h-4 w-4" aria-hidden="true" />{trainMutation.isPending ? "Training model…" : "Train / Retrain Model"}</button>{trainMutation.isPending ? <p className="mt-3 text-xs text-violet-100">Preparing the synthetic dataset and calculating metrics…</p> : null}{trainMutation.error ? <p className="mt-3 text-sm text-rose-200" role="alert">{trainMutation.error.message}</p> : null}</section></div><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div><h2 className="font-semibold text-white">Predict from indicators</h2><p className="mt-1 text-sm leading-6 text-slate-400">The model uses the five indicators below. The API requires a complete observation, so the client supplies a neutral Kazakhstan reference coordinate and today’s date; they are not ML features.</p></div><form onSubmit={submitPrediction} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{([['ndvi', 'NDVI', '-1 to 1', '-1', '1'], ['ndmi', 'NDMI', '-1 to 1', '-1', '1'], ['temperature_c', 'Temperature °C', 'e.g. 32', '-60', '70'], ['precipitation_mm', 'Precipitation mm', 'e.g. 3', '0', '1000'], ['soil_moisture', 'Soil moisture', '0 to 1', '0', '1']] as const).map(([name, label, placeholder, min, max]) => <label key={name} className="block text-sm font-medium text-slate-200">{label}<input required type="number" step="any" min={min} max={max} placeholder={placeholder} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} className="mt-2 min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white placeholder:text-slate-600 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>)}<div className="flex items-end"><button type="submit" disabled={predictionMutation.isPending || metricsQuery.data.status !== "trained"} className="min-h-11 w-full rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-100">{predictionMutation.isPending ? "Predicting…" : "Run prediction"}</button></div></form>{metricsQuery.data.status !== "trained" ? <p className="mt-4 text-sm text-amber-100">Train the model before requesting a prediction.</p> : null}{predictionMutation.error ? <p className="mt-4 text-sm text-rose-200" role="alert">{predictionMutation.error.message}</p> : null}{prediction && displayLevel ? <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="text-sm text-slate-300">Model prediction</p><p className="mt-1 text-xl font-semibold text-white">{prediction.prediction === "drought_prone" ? "Drought-prone conditions" : "Not drought-prone conditions"}</p><p className="mt-3 text-sm text-slate-300">Model risk score (drought probability): <strong className="text-white">{formatPercent(prediction.drought_probability)}</strong></p><p className="mt-1 text-sm text-slate-300">Display level: <strong className="text-white">{RISK_LABELS[displayLevel]}</strong> (derived from probability bands; not a field decision).</p></div> : null}</section></div>;
}
