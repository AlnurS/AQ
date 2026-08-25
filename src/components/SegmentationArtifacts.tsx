import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

import { resolveApiUrl } from "../api/client";
import type { MonitoringObservation } from "../types/api";

interface SegmentationArtifactsProps { observation: MonitoringObservation | null; }

function ArtifactImage({ src, alt, label, caption, overlay }: { src: string; alt: string; label: string; caption: string; overlay?: boolean }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return <figure className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950"><figcaption className="border-b border-slate-800 px-4 py-3"><p className="font-medium text-white">{label}</p><p className="mt-1 text-xs text-slate-400">{caption}</p></figcaption><div className="relative flex aspect-square items-center justify-center bg-slate-900 p-3">{state === "loading" ? <p className="text-sm text-slate-400" role="status">Загружаем изображение…</p> : null}{state === "error" ? <p className="px-5 text-center text-sm text-rose-200" role="alert">Не удалось загрузить изображение анализа.</p> : null}<img src={resolveApiUrl(src)} alt={alt} onLoad={() => setState("ready")} onError={() => setState("error")} className={`h-full w-full object-contain ${overlay ? "bg-slate-900" : "grayscale"} ${state === "ready" ? "opacity-100" : "absolute opacity-0"}`} /></div></figure>;
}

export function SegmentationArtifacts({ observation }: SegmentationArtifactsProps) {
  if (!observation) return <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center"><ImageIcon className="mx-auto h-7 w-7 text-slate-500" aria-hidden="true" /><h2 className="mt-3 font-semibold text-slate-200">Спутниковый анализ</h2><p className="mt-1 text-sm text-slate-400">Запустите анализ, чтобы увидеть реальные изображения.</p></section>;
  return <section className="space-y-4" aria-labelledby="artifacts-title"><div><h2 id="artifacts-title" className="font-semibold text-white">Спутниковый анализ</h2><p className="mt-1 text-xs text-slate-400">Спутниковый patch 256×256, а не полная граница поля.</p></div><div className="grid gap-4 sm:grid-cols-2"><ArtifactImage src={observation.preview_url} alt="Чёрно-белый preview сегментации засухи" label="Превью сегментации" caption="Зоны, выделенные моделью сегментации." /><ArtifactImage src={observation.overlay_url} alt="Прозрачный красный overlay зон с признаками засухи" label="Overlay риска засухи" caption="Красные области требуют полевой проверки." overlay /></div></section>;
}
