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
        description: "Video compression made easy. Maintain the best quality while resizing your mp4 files to any size, for any purpose. Fast and private transcoding locally on any device.",
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
