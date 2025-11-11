import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "url";


export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    alias: {

      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});