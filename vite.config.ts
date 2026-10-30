import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This matches the GitHub Pages address:
// https://troll2281488.github.io/ntntgrsntrntrntrtn/
export default defineConfig({
  plugins: [react()],
  base: "/ntntgrsntrntrntrtn/",
});
