# AQUA KZ frontend

Frontend for the AQUA KZ drought and water-deficit monitoring prototype. It presents the real monitoring workflow and a separate national screening view without claiming full Kazakhstan coverage.

## Setup

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

For a production build:

```powershell
cd frontend
npm.cmd run build
```

The frontend uses `VITE_API_BASE_URL` when set; otherwise it requests the backend at `http://127.0.0.1:8000`.

## Primary routes

- `/` redirects to `/monitoring`.
- `/monitoring` is the point-based monitoring workflow backed by `/api/monitoring/*`. It displays only fields returned by the monitoring API and reports unavailable observations as unavailable.
- `/national-map` is a coarse national screening map. Coverage is partial: only processed grid cells have results, while missing, failed, and stale cells are shown as unavailable rather than low risk.

## Legacy demonstration routes

- `/dashboard`, `/drone-targets`, and `/model` remain directly reachable for existing demonstrations.
- These legacy pages use local synthetic observations, rule-based values, or the local classifier. They are not primary satellite-monitoring outputs and each page displays the notice: `Демонстрационные данные. Эта страница не использует результаты спутникового мониторинга.`
- Legacy pages are intentionally excluded from the primary navigation.

## Known limitations

- The national grid is a coarse screening layer with limited processed cells, not full completed coverage of Kazakhstan and not field-level diagnosis.
- The monitoring API may return no result for a requested period when imagery is unavailable or filtering leaves no usable scene.
- Seasonal outlook is unavailable unless a supported probabilistic forecast provider is configured.
