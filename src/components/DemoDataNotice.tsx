import { AlertTriangle } from "lucide-react";

export function DemoDataNotice() {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50" role="note">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" />
      <p className="font-semibold">Демонстрационные данные. Эта страница не использует результаты спутникового мониторинга.</p>
    </div>
  );
}
