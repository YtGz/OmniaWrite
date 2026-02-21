import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ["svelte", "browser", "import"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  define: {
    "process.env.APPWRITE_ENDPOINT": JSON.stringify(
      process.env.APPWRITE_ENDPOINT || "https://appwrite.datawarp.dev/v1"
    ),
    "process.env.APPWRITE_PROJECT": JSON.stringify(
      process.env.APPWRITE_PROJECT || ""
    ),
    "process.env.APPWRITE_BUCKET_ID": JSON.stringify(
      process.env.APPWRITE_BUCKET_ID || "backups"
    ),
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  server: {
    port: 8080,
  },
});
