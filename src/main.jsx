import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider, theme } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient.js";
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: "#a3e635", colorTextLightSolid: "#020617" },
      }}
    >
      <App />
    </ConfigProvider>
  </QueryClientProvider>,
);
