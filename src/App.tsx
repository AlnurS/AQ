import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DroneTargetsPage } from "./pages/DroneTargetsPage";
import { ModelPage } from "./pages/ModelPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { NationalMapPage } from "./pages/NationalMapPage";

export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<Navigate to="/monitoring" replace />} /><Route path="dashboard" element={<DashboardPage />} /><Route path="monitoring" element={<MonitoringPage />} /><Route path="national-map" element={<NationalMapPage />} /><Route path="drone-targets" element={<DroneTargetsPage />} /><Route path="model" element={<ModelPage />} /></Route><Route path="*" element={<NotFoundPage />} /></Routes>;
}
