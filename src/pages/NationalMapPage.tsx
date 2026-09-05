import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Info, MapPinned, Satellite } from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import { getNationalGrid, getNationalGridSummary } from "../api/endpoints";
import type { NationalGridCell, NationalGridSummary } from "../types/api";
import { formatCoordinate, formatPercent } from "../utils/formatters";

const DEFAULT_YEAR = 2024;
const DEFAULT_MONTH = 9;

const riskColors: Record<"low" | "medium" | "high" | "critical" | "missing", string> = {
  low: "#34d399",
  medium: "#fbbf24",
  high: "#f97316",
  critical: "#fb7185",
  missing: "#64748b",
};

function formatRussianDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function translateTrend(value: string | null): string {
  return value === "insufficient_data" ? "Недостаточно истории для тренда" : value === "worsening" ? "Ухудшение" : value === "improving" ? "Улучшение" : value === "stable" ? "Стабильный" : "Недостаточно данных";
}

function translateQuality(value: string | null): string {
  return value === "segmentation_only" ? "Только спутниковая сегментация" : value === "partial" ? "Частичные данные" : value === "complete" ? "Полные данные" : "Не указано";
}

function getRiskLevelLabel(level: NationalGridCell["risk_level"]): string {
  return level === "critical" ? "Высокий" : level === "high" ? "Высокий" : level === "medium" ? "Средний" : level === "low" ? "Низкий" : "Нет данных";
}

function getCellSignalInfo(cell: NationalGridCell) {
  const score = cell.risk_score ?? cell.drought_fraction ?? 0;
  const scorePercent = score > 0 ? formatPercent(score) : "0%";
  if (cell.is_screening_cell && cell.data_quality === "segmentation_only") {
    const preliminaryLevel = score >= 0.75 || cell.risk_level === "high" || cell.risk_level === "critical" ? "высокий" : score >= 0.4 ? "средний" : "низкий";
    return {
      header: "Сигнал сегментации",
      value: scorePercent,
      preliminary: `Предварительный уровень: ${preliminaryLevel}`,
      confidence: cell.confidence_label || "Уверенность: ограниченная — только спутниковая сегментация",
      detail: `Доля пикселей с признаками засухи: ${cell.drought_fraction != null ? formatPercent(cell.drought_fraction) : "—"}`,
    };
  }

  const level = getRiskLevelLabel(cell.risk_level);
  return {
    header: "Риск",
    value: `${level} · ${scorePercent}`,
    preliminary: `Риск: ${level}`,
    confidence: cell.confidence_label || "Качество данных не уточнено",
    detail: `Доля пикселей с признаками засухи: ${cell.drought_fraction != null ? formatPercent(cell.drought_fraction) : "—"}`,
  };
}

function getPathOptions(cell: NationalGridCell) {
  const generic = {
    weight: cell.data_quality === "segmentation_only" ? 2 : 1,
    opacity: 1,
    fillOpacity: 0.75,
    dashArray: cell.data_quality === "segmentation_only" ? "6 6" : undefined,
  };

  if (cell.status !== "ready") {
    return {
      ...generic,
      color: riskColors.missing,
      fillColor: riskColors.missing,
    };
  }

  const riskLevel = cell.risk_level ?? "low";
  const baseColor = riskColors[riskLevel === "critical" ? "critical" : riskLevel === "high" ? "high" : riskLevel === "medium" ? "medium" : "low"];
  return {
    ...generic,
    color: baseColor,
    fillColor: baseColor,
  };
}

function CellMarker({ cell }: { cell: NationalGridCell }) {
  const signal = getCellSignalInfo(cell);
  const riskText = cell.status !== "ready" ? "Нет данных" : cell.data_quality === "segmentation_only" ? "Сигнал сегментации" : `Риск: ${getRiskLevelLabel(cell.risk_level)}`;

  return (
    <CircleMarker center={[cell.latitude, cell.longitude]} radius={cell.status === "ready" ? 10 : 8} pathOptions={getPathOptions(cell)}>
      <Popup minWidth={260}>
        <div className="space-y-2 text-sm text-slate-800">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <span className="font-semibold text-slate-900">{cell.cell_id}</span>
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-700">
              {cell.status === "ready" ? "готово" : cell.status}
            </span>
          </div>

          {cell.is_screening_cell && cell.data_quality === "segmentation_only" ? (
            <>
              <p><strong>Сигнал сегментации:</strong> {signal.value}</p>
              <p><strong>Предварительный уровень:</strong> {signal.preliminary.replace("Предварительный уровень: ", "")}</p>
              <p><strong>Уверенность:</strong> {cell.confidence_label || signal.confidence}</p>
            </>
          ) : (
            <>
              <p><strong>Риск:</strong> {riskText}</p>
              <p><strong>Риск:</strong> {signal.value}</p>
            </>
          )}
          <p><strong>Качество данных:</strong> {translateQuality(cell.data_quality)}</p>
          <p><strong>Тренд:</strong> {translateTrend(cell.trend)}</p>
          <p><strong>Дата:</strong> {formatRussianDate(cell.observed_at)}</p>
          <p><strong>Доля пикселей с признаками засухи:</strong> {cell.drought_fraction != null ? formatPercent(cell.drought_fraction) : "—"}</p>

          {cell.drivers?.length ? (
            <div>
              <p className="font-medium text-slate-800">Причины:</p>
              <ul className="ml-4 list-disc space-y-1 text-slate-700">
                {cell.drivers.slice(0, 3).map((driver) => (
                  <li key={driver.key}>{driver.title}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p><strong>Координаты:</strong> {formatCoordinate(cell.latitude)}, {formatCoordinate(cell.longitude)}</p>
          <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
            {cell.disclaimer || "Это не диагностика отдельного поля."}
          </p>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function NationalGridSummaryCard({ summary, cells }: { summary: NationalGridSummary | undefined; cells: NationalGridCell[] }) {
  const readyCount = cells.filter((cell) => cell.status === "ready").length;
  const preliminaryHighSignalCount = cells.filter(
    (cell) => cell.status === "ready" && cell.data_quality === "segmentation_only" && (cell.risk_level === "high" || cell.risk_level === "critical"),
  ).length;
  const highCount = (summary?.risk_counts.high ?? 0) + (summary?.risk_counts.critical ?? 0);
  const summaryTitle = preliminaryHighSignalCount > 0 ? "Высокие предварительные сигналы" : "Высокий риск";
  const tooltip = "Количество ячеек с высоким сигналом сегментации или высоким риском среди подготовленных данных.";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Сводка</p>
          <div className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
            <span>{summaryTitle}</span>
            <span title={tooltip} className="inline-flex items-center text-slate-400" aria-label={tooltip}><Info className="h-4 w-4" /></span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold text-white">{highCount}</p>
          <p className="text-xs text-slate-400">из {readyCount} готовых</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          ["Готово", summary?.ready ?? 0],
          ["Отсутствует", summary?.missing ?? 0],
          ["Ошибка", summary?.failed ?? 0],
          ["Устарело", summary?.stale ?? 0],
        ].map(([label, count]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NationalMapPage() {
  const filters = { year: DEFAULT_YEAR, month: DEFAULT_MONTH };
  const cellsQuery = useQuery({ queryKey: ["national-grid", filters], queryFn: () => getNationalGrid(filters), retry: false });
  const summaryQuery = useQuery({ queryKey: ["national-grid-summary", filters], queryFn: () => getNationalGridSummary(filters), retry: false });

  const cells = cellsQuery.data ?? [];
  const summary = summaryQuery.data;
  const readyCells = cells.filter((cell) => cell.status === "ready");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200"><Satellite className="h-4 w-4" aria-hidden="true" />AQUA KZ</p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Национальный скрининг по ячейкам</h1>
          <p className="mt-2 text-sm text-slate-400">Крупномасштабный экранный слой: не диагностика конкретного поля, а приоритезация проверки на уровне сетки.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100">
          <MapPinned className="h-4 w-4" aria-hidden="true" />
          {readyCells.length} подготовленных ячеек
        </div>
      </header>

      {summary ? <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4" aria-label="Метаданные национального скрининга"><div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-slate-400">Период</p><p className="mt-1 font-semibold text-white">{summary.year} · {String(summary.month).padStart(2, "0")}</p></div><div><p className="text-xs text-slate-400">Версия сетки</p><p className="mt-1 font-semibold text-white">{summary.grid_version}</p></div><div><p className="text-xs text-slate-400">Последнее обновление</p><p className="mt-1 font-semibold text-white">{summary.most_recent_update ? formatRussianDate(summary.most_recent_update.slice(0, 10)) : "—"}</p></div><div><p className="text-xs text-slate-400">Сигналы</p><p className="mt-1 font-semibold text-white">{cells.filter((cell) => cell.status === "ready" && cell.data_quality === "segmentation_only").length} предварительных · {cells.filter((cell) => cell.status === "ready" && cell.data_quality !== "segmentation_only").length} многосигнальных</p></div></div><p className="mt-3 text-xs leading-5 text-slate-400">Состояния ячеек: готово {summary.ready}, нет данных {summary.missing}, ошибка {summary.failed}, устарело {summary.stale}. Предварительные сигналы сегментации отображаются отдельно от многосигнального риска.</p></section> : null}

      <NationalGridSummaryCard summary={summary} cells={cells} />

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/75">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Скрининговая карта Казахстана</h2>
            <p className="mt-1 text-xs text-slate-400">Ячейки 1° × 1° · состояние обновляется по год/месяцу</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs text-amber-100">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Не полевая диагностика
          </div>
        </div>

        <div className="h-[540px]">
          <MapContainer center={[48, 67]} zoom={5} scrollWheelZoom className="h-full w-full" aria-label="Карта национального скрининга Казахстана">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {cells.map((cell) => (
              <CellMarker key={cell.cell_id} cell={cell} />
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
