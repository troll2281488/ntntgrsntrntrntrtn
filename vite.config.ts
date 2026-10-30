import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This matches the GitHub Pages address:
// https://troll2281488.github.io/dodododod/
export default defineConfig({
  plugins: [react()],
  base: "/dodododod/",
});
