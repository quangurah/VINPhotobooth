
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initConsoleCapture } from "./app/utils/logger";

  // Kích hoạt ghi nhận log console để hiển thị ở mục Nhật ký xử lý của Dashboard
  initConsoleCapture();

  createRoot(document.getElementById("root")!).render(<App />);
  