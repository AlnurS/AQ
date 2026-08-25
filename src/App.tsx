import { Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DroneTargetsPage } from "./pages/DroneTargetsPage";
import { ModelPage } from "./pages/ModelPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MonitoringPage } from "./pages/MonitoringPage";

export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<DashboardPage />} /><Route path="monitoring" element={<MonitoringPage />} /><Route path="drone-targets" element={<DroneTargetsPage />} /><Route path="model" element={<ModelPage />} /></Route><Route path="*" element={<NotFoundPage />} /></Routes>;
}
