// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // or your framework plugin

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Your API server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
