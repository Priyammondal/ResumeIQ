import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  optimizeDeps: {
    include: ["react", "react-dom", "react-router"],
  },

  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router"],
          icons: ["react-icons"],
        },
      },
    },
  },
});
