import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Curtains } from "curtainsjs";

// Tạo WebGL Context để truyền instance curtains cho các Plane
const WebGLContext = createContext<Curtains | null>(null);

export const useWebGL = () => useContext(WebGLContext);

// Hàm tạo ảnh nhiễu (displacement noise map) bằng Canvas 2D để tránh tải ảnh ngoài
export function createNoiseTextureURL(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imgData = ctx.createImageData(128, 128);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const x = (i / 4) % 128;
    const y = Math.floor((i / 4) / 128);
    // Kết hợp sóng sin và random nhẹ tạo ra noise lượn sóng mượt mà
    const val = Math.floor(
      (Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.4 + 0.5 + Math.random() * 0.1) * 255
    );
    imgData.data[i] = val;     // R
    imgData.data[i + 1] = val; // G
    imgData.data[i + 2] = val; // B
    imgData.data[i + 3] = 255; // A
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

export default function WebGLCanvas({ children }: { children: React.ReactNode }) {
  const [curtains, setCurtains] = useState<Curtains | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("[WebGL] Khởi tạo curtains.js...");
    // Khởi tạo instance curtainsjs trên container
    const curtainsInstance = new Curtains({
      container: containerRef.current,
      autoRender: true,
      pixelRatio: Math.min(1.5, window.devicePixelRatio), // Giới hạn pixelRatio để tăng hiệu năng
    });

    setCurtains(curtainsInstance);

    curtainsInstance.onError(() => {
      console.error("[WebGL] Khởi tạo curtains.js thất bại");
    });

    return () => {
      console.log("[WebGL] Hủy curtains.js...");
      console.log(
        "[DEBUG][WebGLCanvas] curtainsInstance methods check:",
        typeof curtainsInstance.dispose === "function" ? "has dispose" : "no dispose",
        typeof curtainsInstance.destroy === "function" ? "has destroy" : "no destroy"
      );
      if (typeof curtainsInstance.dispose === "function") {
        curtainsInstance.dispose();
      } else if (typeof curtainsInstance.destroy === "function") {
        // Fallback phòng hờ
        (curtainsInstance as any).destroy();
      }
    };
  }, []);

  return (
    <WebGLContext.Provider value={curtains}>
      {/* Canvas container cố định toàn màn hình */}
      <div
        ref={containerRef}
        id="canvas-webgl"
        className="fixed inset-0 pointer-events-none w-full h-full"
        style={{ zIndex: 1 }}
      />
      {children}
    </WebGLContext.Provider>
  );
}
