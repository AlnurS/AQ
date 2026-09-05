import { useQuery } from "@tanstack/react-query";

import { getRiskSummary, getRiskZones } from "../api/endpoints";
import { DashboardHeader } from "../components/DashboardHeader";
import { DemoDataNotice } from "../components/DemoDataNotice";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { MetricsCards } from "../components/MetricsCards";
import { ObservationTable } from "../components/ObservationTable";
import { PageLoader } from "../components/PageLoader";
import { RiskDistributionChart } from "../components/RiskDistributionChart";
import { RiskMap } from "../components/RiskMap";

export function DashboardPage() {
  const summaryQuery = useQuery({ queryKey: ["risk-summary"], queryFn: getRiskSummary, retry: 2 });
  const zonesQuery = useQuery({ queryKey: ["risk-zones"], queryFn: getRiskZones, retry: 2 });
  const error = summaryQuery.error ?? zonesQuery.error;

  if (summaryQuery.isLoading || zonesQuery.isLoading) return <PageLoader />;
  if (error) return <ErrorState message={error.message} onRetry={() => { void summaryQuery.refetch(); void zonesQuery.refetch(); }} />;
  if (!summaryQuery.data || !zonesQuery.data?.length) return <><DashboardHeader /><div className="mt-6"><EmptyState title="No risk observations available" description="The backend returned no local observations. Confirm the synthetic CSV data is available." /></div></>;

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DemoDataNotice />
      <MetricsCards summary={summaryQuery.data} />
      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]"><RiskMap observations={zonesQuery.data} /><RiskDistributionChart summary={summaryQuery.data} /></div>
      <ObservationTable observations={[...zonesQuery.data].sort((first, second) => second.date.localeCompare(first.date))} />
      <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-5 text-amber-100">Educational use only: observations and risk values are synthetic and the rule-based score is not a validated drought forecast.</p>
    </div>
  );
}
