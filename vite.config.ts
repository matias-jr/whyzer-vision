import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { apiPlugin } from "./vite-api-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // The api/ handlers read process.env directly (GHL_TOKEN, GHL_LOCATION_ID,
  // Supabase keys). Vite only exposes VITE_-prefixed vars to client code, so
  // load the rest into process.env for the local API plugin in dev.
  if (mode === "development") {
    Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && apiPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
