import L from "leaflet";
import { CircleAlert } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Observation, RiskLevel } from "../types/api";
import { formatDate, formatNumber } from "../utils/formatters";
import { RISK_COLORS } from "../utils/risk";
import { RiskLegend } from "./RiskLegend";

interface RiskMapProps {
  observations: Observation[];
}

function markerIcon(level: RiskLevel): L.DivIcon {
  const color = RISK_COLORS[level];
  return L.divIcon({
    className: "risk-marker",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:3px solid #0f172a;box-shadow:0 0 0 1px ${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function RiskMap({ observations }: RiskMapProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="flex flex-col gap-1 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-white">Risk zones across Kazakhstan</h2><p className="mt-1 text-xs text-slate-400">WGS84 coordinates · synthetic observations · click a marker for measured indicators</p></div><p className="inline-flex items-center gap-1.5 text-xs text-slate-400"><CircleAlert className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" /> Not field-validated</p></div>
      <div className="relative h-[440px] min-h-[320px]">
        <MapContainer center={[48, 67]} zoom={5} scrollWheelZoom className="h-full w-full" aria-label="Drought risk map of Kazakhstan">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {observations.map((observation) => (
            <Marker key={observation.id} position={[observation.latitude, observation.longitude]} icon={markerIcon(observation.risk_level)}>
              <Popup minWidth={250}>
                <div className="risk-popup"><p><strong>{observation.id}</strong> · {formatDate(observation.date)}</p><p><strong>NDVI:</strong> {formatNumber(observation.ndvi)} · <strong>NDMI:</strong> {formatNumber(observation.ndmi)}</p><p><strong>Temperature:</strong> {formatNumber(observation.temperature_c)} °C</p><p><strong>Precipitation:</strong> {formatNumber(observation.precipitation_mm)} mm · <strong>Soil moisture:</strong> {formatNumber(observation.soil_moisture)}</p><p><strong>Risk score:</strong> {formatNumber(observation.risk_score)} ({observation.risk_level})</p><p><strong>Assessment:</strong> {observation.explanation}</p></div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <RiskLegend />
      </div>
    </section>
  );
}
