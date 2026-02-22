import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [env.VITE_HOST_NAME]
  },
})
}