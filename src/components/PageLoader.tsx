interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = "Loading monitoring data…" }: PageLoaderProps) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/70 p-8" role="status">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-300 border-r-transparent" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}
