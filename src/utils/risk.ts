import type { RiskLevel } from "../types/api";

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#34d399",
  medium: "#fbbf24",
  high: "#fb7185",
};

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score < 0.4) return "low";
  if (score < 0.7) return "medium";
  return "high";
}
