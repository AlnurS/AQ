import { apiClient } from "./client";
import type {
  DroneTarget,
  ModelMetrics,
  Observation,
  PredictionRequest,
  PredictionResponse,
  RiskSummary,
  AnalyzeMonitoringResponse,
  BackfillResponse,
  CreateMonitoringLocationRequest,
  LatestResponse,
  MonitoringLocation,
  SeasonalOutlookResponse,
  TimelineResponse,
} from "../types/api";

export async function getRiskSummary(): Promise<RiskSummary> {
  const { data } = await apiClient.get<RiskSummary>("/api/risk-summary");
  return data;
}

export async function getRiskZones(): Promise<Observation[]> {
  const { data } = await apiClient.get<Observation[]>("/api/risk-zones");
  return data;
}

export async function getDroneTargets(): Promise<DroneTarget[]> {
  const { data } = await apiClient.get<DroneTarget[]>("/api/drone-targets");
  return data;
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  const { data } = await apiClient.get<ModelMetrics>("/api/model-metrics");
  return data;
}

export async function trainModel(): Promise<ModelMetrics> {
  const { data } = await apiClient.post<ModelMetrics>("/api/train-model");
  return data;
}

export async function predictDrought(payload: PredictionRequest): Promise<PredictionResponse> {
  const { data } = await apiClient.post<PredictionResponse>("/api/predict", payload);
  return data;
}

export async function getMonitoringLocations(): Promise<MonitoringLocation[]> {
  const { data } = await apiClient.get<MonitoringLocation[]>("/api/monitoring/locations");
  return data;
}

export async function createMonitoringLocation(payload: CreateMonitoringLocationRequest): Promise<MonitoringLocation> {
  const { data } = await apiClient.post<MonitoringLocation>("/api/monitoring/locations", payload);
  return data;
}

export async function getMonitoringLatest(locationId: string): Promise<LatestResponse> {
  const { data } = await apiClient.get<LatestResponse>(`/api/monitoring/locations/${locationId}/latest`);
  return data;
}

export async function getMonitoringTimeline(locationId: string): Promise<TimelineResponse> {
  const { data } = await apiClient.get<TimelineResponse>(`/api/monitoring/locations/${locationId}/timeline`);
  return data;
}

export async function analyzeMonitoringLocation(locationId: string, year: number, month: number): Promise<AnalyzeMonitoringResponse> {
  const { data } = await apiClient.post<AnalyzeMonitoringResponse>(`/api/monitoring/locations/${locationId}/analyze`, { year, month, enrich: false });
  return data;
}

export async function getMonitoringOutlook(locationId: string): Promise<SeasonalOutlookResponse> {
  const { data } = await apiClient.get<SeasonalOutlookResponse>(`/api/monitoring/locations/${locationId}/outlook`);
  return data;
}

export async function backfillMonitoringLocation(locationId: string, startDate: string, endDate: string): Promise<BackfillResponse> {
  const { data } = await apiClient.post<BackfillResponse>(`/api/monitoring/locations/${locationId}/backfill`, { start_date: startDate, end_date: endDate, enrich: false, force: false });
  return data;
}
