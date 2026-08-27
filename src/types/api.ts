export type RiskLevel = "low" | "medium" | "high";

export interface RiskAssessment {
  risk_score: number;
  risk_level: RiskLevel;
  reasons: string[];
  explanation: string;
}

export interface Observation extends RiskAssessment {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
  ndvi: number;
  ndmi: number;
  temperature_c: number;
  precipitation_mm: number;
  soil_moisture: number;
}

export interface RiskSummary {
  total_observations: number;
  low_count: number;
  medium_count: number;
  high_count: number;
  average_risk_score: number;
}

export interface DroneTarget {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
  risk_score: number;
  risk_level: "high";
  reason: string;
  recommended_action: string;
}

export interface ModelMetrics {
  status: "trained" | "not_trained";
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  training_rows: number | null;
}

export interface PredictionRequest {
  latitude: number;
  longitude: number;
  date: string;
  ndvi: number;
  ndmi: number;
  temperature_c: number;
  precipitation_mm: number;
  soil_moisture: number;
}

export interface PredictionResponse {
  drought_label: 0 | 1;
  prediction: "not_drought_prone" | "drought_prone";
  drought_probability: number;
}

export interface ApiErrorShape {
  detail?: string;
  message?: string;
}

export type MonitoringRiskLevel = "low" | "medium" | "high" | "critical";
export type MonitoringTrend = "improving" | "stable" | "worsening" | "insufficient_data";
export type DataQuality = "complete" | "partial" | "segmentation_only";
export type RecommendationSeverity = "info" | "warning" | "danger";
export type RecommendationPriority = "low" | "medium" | "high";

export interface RecommendationDriver {
  key: string;
  severity: RecommendationSeverity;
  title: string;
  detail: string;
}

export interface RecommendationItem {
  key: string;
  priority: RecommendationPriority;
  title: string;
  detail: string;
}

export interface RecommendationSet {
  drivers: RecommendationDriver[];
  recommendations: RecommendationItem[];
  disclaimer: string;
}

export interface MonitoringLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string | null;
  created_at: string;
  active: boolean;
}

export interface CreateMonitoringLocationRequest {
  name: string;
  latitude: number;
  longitude: number;
  region?: string | null;
}

export interface MonitoringRun {
  id: string;
  created_at: string;
  source_type: "upload" | "coordinates";
  upload_filename: string | null;
  latitude: number | null;
  longitude: number | null;
  year: number | null;
  requested_year: number | null;
  requested_month: number | null;
  scene_start_date: string | null;
  scene_end_date: string | null;
  satellite_source: string | null;
  width: number;
  height: number;
  drought_threshold: number;
  drought_fraction: number;
  drought_pixel_count: number;
  total_pixel_count: number;
  mask_url: string;
  preview_url: string;
  overlay_url: string;
}

export interface MonitoringObservation {
  id: string;
  location_id: string;
  observed_at: string;
  inference_run_id: string;
  year: number;
  month: number;
  drought_fraction: number;
  drought_pixel_count: number;
  total_pixel_count: number;
  ndvi: number | null;
  ndmi: number | null;
  ndvi_baseline: number | null;
  ndmi_baseline: number | null;
  ndvi_anomaly: number | null;
  ndmi_anomaly: number | null;
  precipitation_mm: number | null;
  precipitation_anomaly: number | null;
  temperature_c: number | null;
  temperature_anomaly: number | null;
  soil_moisture: number | null;
  soil_moisture_anomaly: number | null;
  vegetation_stress: number | null;
  rainfall_stress: number | null;
  soil_moisture_stress: number | null;
  heat_stress: number | null;
  segmentation_stress: number;
  risk_score: number;
  risk_level: MonitoringRiskLevel;
  trend: MonitoringTrend;
  explanation: string;
  data_quality: DataQuality;
  data_source: string;
  metadata: Record<string, string> | null;
  created_at: string;
  preview_url: string;
  overlay_url: string;
  inference_run: MonitoringRun | null;
  recommendations: RecommendationSet | null;
}

export interface AnalyzeMonitoringResponse {
  location: MonitoringLocation;
  inference_run: MonitoringRun;
  observation: MonitoringObservation;
  component_stress: Record<string, number | null>;
  risk_score: number;
  risk_level: MonitoringRiskLevel;
  trend: MonitoringTrend;
  explanation: string;
  data_quality: DataQuality;
  preview_url: string;
  overlay_url: string;
  recommendations: RecommendationSet | null;
}

export interface TimelineSummary {
  latest_risk_score: number | null;
  latest_risk_level: MonitoringRiskLevel | null;
  latest_drought_fraction: number | null;
  observation_count: number;
  trend: MonitoringTrend;
  risk_score_change: number | null;
  drought_fraction_change: number | null;
  data_quality_notes: string[];
}

export interface TimelineResponse {
  location: MonitoringLocation;
  observations: MonitoringObservation[];
  summary: TimelineSummary;
}

export interface LatestResponse {
  location: MonitoringLocation;
  observation: MonitoringObservation;
}

export interface SeasonalOutlookResponse {
  status: "unavailable" | "available";
  forecast_available: boolean;
  message: string;
  limitations: string[];
  probabilities: Record<string, number> | null;
}

export interface BackfillResponse {
  location_id: string;
  created: number;
  skipped: number;
  failed: number;
  periods: string[];
}
