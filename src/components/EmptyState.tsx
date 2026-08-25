import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/50 p-8 text-center">
      <Inbox className="mx-auto h-7 w-7 text-cyan-300" aria-hidden="true" />
      <h2 className="mt-3 font-semibold text-slate-100">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">{description}</p>
    </div>
  );
}
