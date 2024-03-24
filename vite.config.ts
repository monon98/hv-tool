import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      build: {
        fileName: "hv-tools.js",
      },
      userscript: {
        name: "hv-tools",
        author: "monon98",
        icon: "https://hentaiverse.org/isekai/y/favicon.png",
        version: "0.0.3",
        namespace: "https://github.com/monon98",
        description: "基于HV Utils使用，增强功能",
        match: [
          "*://hentaiverse.org/isekai/?s=Bazaar&ss=es*",
          "*://hentaiverse.org/?s=Bazaar&ss=es*",
          "*://hentaiverse.org/isekai/?s=Forge&ss=up*",
          "*://hentaiverse.org/?s=Forge&ss=up*",
          "*://hentaiverse.org/?s=Bazaar&ss=ml*",
          "*://hentaiverse.org/isekai/?s=Bazaar&ss=mk&screen=*&filter=*&itemid=*",
          "*://hentaiverse.org/?s=Bazaar&ss=mk&screen=*&filter=*&itemid=*",
        ],
      },
    }),
  ],
});
