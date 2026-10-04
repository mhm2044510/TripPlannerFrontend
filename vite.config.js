import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/TripPlannerFrontend/",
  // server: {
  //   proxy: {
  //     // 1. Intercepts any request starting with /api
  //     "/api": {
  //       // 2. Change this to your exact backend API URL (Node/Express, Python, etc.)
  //       target: "https://tripplanner-gm2n.onrender.com",
  //       changeOrigin: true,
  //       // 3. Optional: Removes '/api' from the path before hitting the server
  //       // If your backend expects http://localhost:5000/users instead of /api/users
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
});
