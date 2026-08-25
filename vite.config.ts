import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "map-vendor": ["leaflet", "react-leaflet"],
          "chart-vendor": ["recharts"],
        },
      },
    },
  },
});
