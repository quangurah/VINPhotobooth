// e:\msb\tapchidisan\trang chủ\src\app\utils\logger.ts

const MAX_LOGS = 500;
const MAX_LENGTH = 1000;

export interface LogEntry {
  timestamp: string;
  type: "log" | "info" | "warn" | "error";
  message: string;
}

// Hàm làm sạch đối số log, loại bỏ Base64 và cắt ngắn chuỗi quá dài
function cleanArg(arg: any): string {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  
  if (arg instanceof Error) {
    return `${arg.name}: ${arg.message}\nStack: ${arg.stack || ""}`;
  }

  if (typeof arg === "object") {
    try {
      const str = JSON.stringify(arg);
      if (str.length > MAX_LENGTH) {
        return str.substring(0, MAX_LENGTH) + "... [Truncated due to size]";
      }
      return str;
    } catch (e) {
      return String(arg);
    }
  }

  const strArg = String(arg);
  
  // Loại bỏ base64 image data
  if (strArg.includes("data:image/") || strArg.includes(";base64,")) {
    return "[Base64 Image Data]";
  }
  
  if (strArg.length > MAX_LENGTH) {
    return strArg.substring(0, MAX_LENGTH) + "... [Truncated due to size]";
  }
  
  return strArg;
}

export function initConsoleCapture() {
  if (typeof window === "undefined") return;
  
  // Tránh khởi tạo lặp lại
  if ((window as any).__consoleCaptured) return;
  (window as any).__consoleCaptured = true;

  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  const appendLog = (type: "log" | "info" | "warn" | "error", args: any[]) => {
    try {
      const message = args.map(cleanArg).join(" ");
      const timestamp = new Date().toISOString();
      const logEntry: LogEntry = { timestamp, type, message };

      // Đọc logs cũ từ localStorage
      const existingLogsStr = localStorage.getItem("diSanConsoleLogs");
      let existingLogs: LogEntry[] = [];
      if (existingLogsStr) {
        try {
          existingLogs = JSON.parse(existingLogsStr);
        } catch (e) {
          existingLogs = [];
        }
      }

      existingLogs.push(logEntry);

      // Giới hạn số lượng log tối đa
      if (existingLogs.length > MAX_LOGS) {
        existingLogs = existingLogs.slice(existingLogs.length - MAX_LOGS);
      }

      localStorage.setItem("diSanConsoleLogs", JSON.stringify(existingLogs));
    } catch (err) {
      // Viết lỗi trực tiếp ra console gốc để tránh lặp vô hạn
      originalError.apply(console, ["[Logger Error]", err]);
    }
  };

  console.log = (...args) => {
    originalLog.apply(console, args);
    appendLog("log", args);
  };

  console.info = (...args) => {
    originalInfo.apply(console, args);
    appendLog("info", args);
  };

  console.warn = (...args) => {
    originalWarn.apply(console, args);
    appendLog("warn", args);
  };

  console.error = (...args) => {
    originalError.apply(console, args);
    appendLog("error", args);
  };
}

export function getCapturedLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  const logsStr = localStorage.getItem("diSanConsoleLogs");
  if (!logsStr) return [];
  try {
    return JSON.parse(logsStr);
  } catch (e) {
    return [];
  }
}

export function clearCapturedLogs() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("diSanConsoleLogs");
}
