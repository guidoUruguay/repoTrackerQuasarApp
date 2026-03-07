import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://localhost:4444";
  const port = parseInt(env.VITE_PORT || "4445", 10);

  return {
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      quasar(),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
