import { FormEvent, useState } from "react";
import { MapPin, Plus, X } from "lucide-react";

import type { CreateMonitoringLocationRequest } from "../types/api";

interface LocationFormProps {
  isPending: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (payload: CreateMonitoringLocationRequest) => void;
}

export function LocationForm({ isPending, error, onCancel, onSubmit }: LocationFormProps) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    if (!name.trim() || !Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90 || !Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
      setValidationError("Укажите название и координаты в допустимом диапазоне.");
      return;
    }
    setValidationError(null);
    onSubmit({ name: name.trim(), latitude: parsedLatitude, longitude: parsedLongitude, region: region.trim() || null });
  }

  return (
    <section className="rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-4" aria-labelledby="new-location-title">
      <div className="flex items-start justify-between gap-3">
        <div><h2 id="new-location-title" className="flex items-center gap-2 font-semibold text-white"><MapPin className="h-4 w-4 text-cyan-200" aria-hidden="true" />Новая точка мониторинга</h2><p className="mt-1 text-xs text-slate-400">Добавьте поле или контрольную точку в Казахстане.</p></div>
        <button type="button" onClick={onCancel} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300" aria-label="Закрыть форму"><X className="h-4 w-4" /></button>
      </div>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-sm text-slate-200">Название<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
        <label className="block text-sm text-slate-200">Регион <span className="text-slate-500">(необязательно)</span><input value={region} onChange={(event) => setRegion(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="block text-sm text-slate-200">Широта<input required type="number" step="any" min="-90" max="90" value={latitude} onChange={(event) => setLatitude(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label><label className="block text-sm text-slate-200">Долгота<input required type="number" step="any" min="-180" max="180" value={longitude} onChange={(event) => setLongitude(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label></div>
        {validationError || error ? <p className="text-sm text-rose-200" role="alert">{validationError ?? error}</p> : null}
        <button type="submit" disabled={isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-100"><Plus className="h-4 w-4" aria-hidden="true" />{isPending ? "Сохраняем…" : "Добавить точку"}</button>
      </form>
    </section>
  );
}
