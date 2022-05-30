import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', 
      manifest: {
        name: "Tsubasa 🦋",
        short_name: "Tsubasa",
        description: "Tsubasa is a fast video compression service that runs locally on your device. Maintain the best quality while staying under MB file limits.",
        background_color: "#6366f1",
        theme_color: "#6366f1",
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/mediainfo.js/dist/MediaInfoModule.wasm",
          dest: ".",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
