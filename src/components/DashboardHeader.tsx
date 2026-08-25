import { CloudSun, Database } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200"><CloudSun className="h-4 w-4" aria-hidden="true" /> Kazakhstan monitoring overview</p>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">AI Drought Monitoring Platform</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Satellite-derived indicators and weather signals for educational drought-risk assessment</p>
      </div>
      <div className="flex items-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 sm:self-auto"><Database className="h-4 w-4 text-cyan-200" aria-hidden="true" /> Local synthetic dataset</div>
    </header>
  );
}
