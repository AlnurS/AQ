import L from "leaflet";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { MonitoringLocation, MonitoringObservation } from "../types/api";
import { formatCoordinate, formatNumber } from "../utils/formatters";

interface KazakhstanMapProps {
  locations: MonitoringLocation[];
  selectedId: string | null;
  latest: MonitoringObservation | null;
  onSelect: (id: string) => void;
}

function locationIcon(selected: boolean): L.DivIcon {
  return L.divIcon({ className: "monitoring-marker", html: `<span style="display:block;width:${selected ? 22 : 16}px;height:${selected ? 22 : 16}px;border-radius:9999px;background:${selected ? "#67e8f9" : "#fbbf24"};border:3px solid #082f49;box-shadow:0 0 0 2px ${selected ? "#67e8f9" : "#fbbf24"}88"></span>`, iconSize: [selected ? 22 : 16, selected ? 22 : 16], iconAnchor: [selected ? 11 : 8, selected ? 11 : 8] });
}

export function KazakhstanMap({ locations, selectedId, latest, onSelect }: KazakhstanMapProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/75" aria-labelledby="map-title">
      <div className="border-b border-slate-800 px-5 py-4"><h2 id="map-title" className="flex items-center gap-2 font-semibold text-white"><MapPin className="h-4 w-4 text-cyan-200" aria-hidden="true" />Точки мониторинга</h2><p className="mt-1 text-xs text-slate-400">Нажмите на точку, чтобы выбрать её и открыть последние данные.</p></div>
      <div className="h-[390px] min-h-[320px]"><MapContainer center={[48, 67]} zoom={5} scrollWheelZoom className="h-full w-full" aria-label="Карта точек мониторинга Казахстана"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{locations.map((location) => <Marker key={location.id} position={[location.latitude, location.longitude]} icon={locationIcon(location.id === selectedId)} eventHandlers={{ click: () => onSelect(location.id) }}><Popup><div className="risk-popup"><p><strong>{location.name}</strong></p>{location.region ? <p>{location.region}</p> : null}<p>{formatCoordinate(location.latitude)}, {formatCoordinate(location.longitude)}</p>{location.id === selectedId && latest ? <p><strong>Риск:</strong> {formatNumber(latest.risk_score * 100, 1)}% ({latest.risk_level})</p> : <p>Выберите точку для загрузки анализа.</p>}</div></Popup></Marker>)}</MapContainer></div>
    </section>
  );
}
