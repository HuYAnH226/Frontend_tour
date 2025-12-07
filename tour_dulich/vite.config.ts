import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // ✅ Thay port backend của bạn (8080, 3000, 5000...)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      }
    }
  }
});