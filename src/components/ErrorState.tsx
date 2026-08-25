import { RefreshCw, TriangleAlert } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-50" role="alert">
      <div className="flex gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
        <div>
          <h2 className="font-semibold">Unable to load this data</h2>
          <p className="mt-1 text-sm text-rose-100/80">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-rose-200/30 px-3 text-sm font-semibold hover:bg-rose-100/10 focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry request
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
