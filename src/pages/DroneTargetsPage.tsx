import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";

import { getDroneTargets } from "../api/endpoints";
import { DroneTargetsTable } from "../components/DroneTargetsTable";
import { ErrorState } from "../components/ErrorState";
import { PageLoader } from "../components/PageLoader";

export function DroneTargetsPage() {
  const targetsQuery = useQuery({ queryKey: ["drone-targets"], queryFn: getDroneTargets, retry: 2 });
  if (targetsQuery.isLoading) return <PageLoader label="Loading inspection targets…" />;
  if (targetsQuery.error) return <ErrorState message={targetsQuery.error.message} onRetry={() => { void targetsQuery.refetch(); }} />;
  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Prioritized review queue</p><h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Drone Targets</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">High-risk locations prepared for human review and later simulation workflows.</p></header><div className="flex gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50" role="note"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" /><p>Exported targets are for review and simulation. Do not dispatch a physical drone without legal authorization, safe flight planning, and human verification.</p></div><DroneTargetsTable targets={targetsQuery.data ?? []} /></div>;
}
