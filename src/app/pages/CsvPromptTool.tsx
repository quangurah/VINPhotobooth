import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { 
  Upload, Play, Square, Download, FileText, CheckCircle2, 
  AlertCircle, RefreshCw, Home, HelpCircle, ArrowRight
} from "lucide-react";

// Robust CSV Parser xử lý được dấu phẩy, dấu nháy kép bọc và xuống dòng trong trường dữ liệu
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let entry = "";
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        entry += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(entry.trim());
      entry = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(entry.trim());
      if (row.length > 0 && (row.length > 1 || row[0] !== "")) {
        result.push(row);
      }
      row = [];
      entry = "";
    } else {
      entry += char;
    }
  }
  if (entry !== "" || row.length > 0) {
    row.push(entry.trim());
    result.push(row);
  }
  return result;
}

// Hàm format chuỗi an toàn khi ghi vào CSV
function escapeCSV(val: string): string {
  if (val === null || val === undefined) return "";
  let str = String(val);
  if (str.includes(",") || str.includes("\n") || str.includes("\r") || str.includes('"')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

interface RowItem {
  id: number;
  name: string;
  prideStatement: string;
  status: "idle" | "running" | "success" | "failed";
  error?: string;
  mainInterest?: string;
  visualArchetype?: string;
  futureScenario?: string;
  slogan?: string;
  imagePrompt?: string;
  product?: string;
}

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocal ? "http://127.0.0.1:6000/vinpalace-df621/asia-southeast1/api" : "https://api-phn3coaacq-as.a.run.app";

export default function CsvPromptTool() {
  const navigate = useNavigate();
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<RowItem[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [nameColIndex, setNameColIndex] = useState<number>(0);
  const [descColIndex, setDescColIndex] = useState<number>(1);
  const [concurrency, setConcurrency] = useState<number>(1);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopFlagRef = useRef(false);

  // Xử lý khi chọn file CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      processCsvData(text);
    };
    reader.readAsText(file, "UTF-8");
  };

  // Phân tích văn bản CSV thành các dòng dữ liệu hiển thị
  const processCsvData = (text: string) => {
    if (!text.trim()) return;
    try {
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        alert("File CSV không có dữ liệu!");
        return;
      }
      
      const headerRow = parsed[0];
      setHeaders(headerRow);
      
      // Tự động tìm kiếm vị trí cột phù hợp
      let defaultNameIdx = 0;
      let defaultDescIdx = 1;
      
      headerRow.forEach((h, idx) => {
        const lowerH = h.toLowerCase();
        if (lowerH.includes("tên") || lowerH.includes("name") || lowerH.includes("khách hàng") || lowerH.includes("user")) {
          defaultNameIdx = idx;
        }
        if (lowerH.includes("tự hào") || lowerH.includes("pride") || lowerH.includes("mô tả") || lowerH.includes("di sản") || lowerH.includes("statement")) {
          defaultDescIdx = idx;
        }
      });
      
      setNameColIndex(defaultNameIdx);
      setDescColIndex(defaultDescIdx);
      
      // Chuyển đổi các dòng tiếp theo thành row item
      const dataRows: RowItem[] = [];
      for (let i = 1; i < parsed.length; i++) {
        const row = parsed[i];
        if (row.length === 0 || (row.length === 1 && row[0] === "")) continue;
        
        // Tránh lỗi index vượt quá chiều dài row
        const nameVal = row[defaultNameIdx] || `Khách hàng ${i}`;
        const descVal = row[defaultDescIdx] || "";
        
        dataRows.push({
          id: i,
          name: nameVal,
          prideStatement: descVal,
          status: "idle"
        });
      }
      
      setRows(dataRows);
      setCurrentIndex(0);
      setIsRunning(false);
    } catch (e) {
      alert("Định dạng file CSV không đúng hoặc bị lỗi khi đọc.");
      console.error(e);
    }
  };

  // Cấu hình tải dữ liệu demo mẫu từ CSV đặc tả của dự án
  const handleLoadDemo = () => {
    setFileName("Quy trình MSB - Đặc tả mẫu.csv");
    const demoHeaders = ["Bước", "Hành động", "Tên", "Mô tả/ Pride Statement", "Output mong đợi"];
    setHeaders(demoHeaders);
    setNameColIndex(2);
    setDescColIndex(3);
    
    const demoRows: RowItem[] = [
      {
        id: 1,
        name: "Bạn",
        prideStatement: "Tôi đã đi du lịch 3 nước",
        status: "idle"
      },
      {
        id: 2,
        name: "Minh Tuấn",
        prideStatement: "Tôi xây dựng cửa hàng kinh doanh thời trang tự thiết kế từ số 0",
        status: "idle"
      },
      {
        id: 3,
        name: "Hồng Hạnh",
        prideStatement: "Tôi duy trì thói quen tiết kiệm mỗi tháng để lo tương lai cho con cái học hành",
        status: "idle"
      }
    ];
    setRows(demoRows);
    setCurrentIndex(0);
    setIsRunning(false);
  };

  // Cập nhật khi người dùng đổi cột Tên/Mô tả thủ công
  const handleColIndexesChange = (nameIdx: number, descIdx: number) => {
    setNameColIndex(nameIdx);
    setDescColIndex(descIdx);
    
    if (!csvText) return;
    const parsed = parseCSV(csvText);
    const dataRows: RowItem[] = [];
    for (let i = 1; i < parsed.length; i++) {
      const row = parsed[i];
      if (row.length === 0 || (row.length === 1 && row[0] === "")) continue;
      
      dataRows.push({
        id: i,
        name: row[nameIdx] || `Khách hàng ${i}`,
        prideStatement: row[descIdx] || "",
        status: "idle"
      });
    }
    setRows(dataRows);
    setCurrentIndex(0);
  };

  // Bắt đầu chạy xử lý prompt AI bằng Gemini
  const startProcessing = async () => {
    if (rows.length === 0) {
      alert("Vui lòng tải lên file CSV hoặc chọn dữ liệu mẫu trước!");
      return;
    }
    setIsRunning(true);
    stopFlagRef.current = false;
    
    const itemsToProcess = [...rows];
    let activeIndex = 0;
    
    // Hàm thực hiện chạy 1 dòng
    const processRow = async (index: number) => {
      if (stopFlagRef.current) return;
      
      setRows(prev => {
        const copy = [...prev];
        if (copy[index]) copy[index].status = "running";
        return copy;
      });
      setCurrentIndex(index + 1);

      const item = itemsToProcess[index];
      
      try {
        const res = await fetch(`${BASE_URL}/tclife/generate-prompts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: item.prideStatement,
            name: item.name
          })
        });
        
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Lỗi API backend sinh prompt.");
        }
        
        setRows(prev => {
          const copy = [...prev];
          if (copy[index]) {
            copy[index].status = "success";
            copy[index].mainInterest = data.insight?.main_interest || "";
            copy[index].visualArchetype = data.insight?.visual_archetype || "";
            copy[index].futureScenario = data.insight?.future_scenario || "";
            copy[index].slogan = data.slogan || "";
            copy[index].imagePrompt = data.prompts?.final || "";
            copy[index].product = data.insight?.recommended_msb_product || "";
          }
          return copy;
        });
      } catch (err: any) {
        console.error(`Lỗi dòng ${index + 1}:`, err);
        setRows(prev => {
          const copy = [...prev];
          if (copy[index]) {
            copy[index].status = "failed";
            copy[index].error = err.message || "Lỗi không xác định";
          }
          return copy;
        });
      }
    };

    // Cơ chế chạy tuần tự hoặc song song (concurrency control)
    const runWorker = async () => {
      while (activeIndex < itemsToProcess.length && !stopFlagRef.current) {
        const myIndex = activeIndex;
        activeIndex++;
        await processRow(myIndex);
      }
    };

    // Tạo các luồng chạy song song tương ứng với concurrency
    const workers = [];
    const actualConcurrency = Math.min(concurrency, itemsToProcess.length);
    for (let w = 0; w < actualConcurrency; w++) {
      workers.push(runWorker());
    }

    await Promise.all(workers);
    setIsRunning(false);
    if (!stopFlagRef.current) {
      setCurrentIndex(rows.length);
    }
  };

  // Dừng tiến trình chạy
  const stopProcessing = () => {
    stopFlagRef.current = true;
    setIsRunning(false);
  };

  // Tải file kết quả CSV về máy
  const downloadResults = () => {
    if (rows.length === 0) return;
    
    // Định nghĩa các cột của file CSV xuất ra
    const outputHeaders = [
      "STT",
      "Tên khách hàng",
      "Điều tự hào (Pride Statement)",
      "Trạng thái",
      "Mối quan tâm chính (B4)",
      "Hình mẫu nhân vật (B4)",
      "Kịch bản di sản tương lai 10 năm (B4)",
      "Sản phẩm MSB gợi ý (B4)",
      "Slogan/Quote bìa tạp chí (B5)",
      "Prompt mô tả hình ảnh AI (B6)"
    ];
    
    let csvContent = outputHeaders.map(h => escapeCSV(h)).join(",") + "\n";
    
    rows.forEach((row, idx) => {
      const rowData = [
        row.id,
        row.name,
        row.prideStatement,
        row.status === "success" ? "Thành công" : row.status === "failed" ? `Lỗi: ${row.error}` : "Chưa chạy",
        row.mainInterest || "",
        row.visualArchetype || "",
        row.futureScenario || "",
        row.product || "",
        row.slogan || "",
        row.imagePrompt || ""
      ];
      csvContent += rowData.map(v => escapeCSV(String(v))).join(",") + "\n";
    });
    
    // Đính kèm BOM \uFEFF ở đầu để Excel nhận diện tiếng Việt UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MSB_Prompt_AI_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const successCount = rows.filter(r => r.status === "success").length;
  const failedCount = rows.filter(r => r.status === "failed").length;
  const progressPercent = rows.length > 0 ? Math.round((currentIndex / rows.length) * 100) : 0;

  return (
    <div className="w-full min-h-screen bg-[#0d0d10] text-gray-100 font-sans p-6 md:p-10 flex flex-col gap-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-[#c08028] to-[#ef4029] rounded-xl text-white shadow-[0_8px_16px_rgba(239,64,41,0.2)]">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              MSB Di Sản Tương Lai
              <span className="text-[12px] bg-[#c08028]/20 text-[#c08028] px-2 py-0.5 rounded-full border border-[#c08028]/30">
                AI Prompt Builder Tool
              </span>
            </h1>
            <p className="text-sm text-gray-400">
              Công cụ phân tích và tạo Slogan B5, Prompt hình ảnh B6 hàng loạt từ danh sách CSV
            </p>
          </div>
        </div>
        
        {/* Navigation Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/vinpalacehome2")}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a20] border border-gray-800 hover:border-gray-750 text-gray-300 hover:text-white rounded-lg transition-all text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Về Trang chủ
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#121216] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-2">
              Nạp dữ liệu đầu vào
            </h2>

            {/* Drag & Drop Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-850 hover:border-[#c08028]/50 bg-[#16161c] hover:bg-[#c08028]/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-[#c08028]/10 flex items-center justify-center text-gray-400 group-hover:text-[#c08028] transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">
                  {fileName ? fileName : "Tải lên file CSV của bạn"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng chuẩn UTF-8 chứa cột Tên & Pride Statement
                </p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
              />
            </div>

            {/* Quick Demo Option */}
            <div className="flex items-center justify-between gap-2 bg-[#17171d] border border-gray-850 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c08028]" />
                <span className="text-xs text-gray-400">Bạn muốn kiểm nghiệm nhanh?</span>
              </div>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="text-xs font-semibold text-[#c08028] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#c08028]/10 transition-all border border-[#c08028]/20 hover:border-[#c08028]/30"
              >
                Tải data mẫu B4-B6
              </button>
            </div>

            {/* CSV Settings */}
            {headers.length > 0 && (
              <div className="flex flex-col gap-3 bg-[#17171d] border border-gray-850 rounded-xl p-4">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Cấu hình cột dữ liệu
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium">Cột Họ tên:</label>
                  <select
                    value={nameColIndex}
                    onChange={(e) => handleColIndexesChange(Number(e.target.value), descColIndex)}
                    className="w-full bg-[#1e1e24] border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c08028]"
                  >
                    {headers.map((h, idx) => (
                      <option key={idx} value={idx}>{h || `Cột ${idx + 1}`}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium">Cột Điều tự hào / Mô tả:</label>
                  <select
                    value={descColIndex}
                    onChange={(e) => handleColIndexesChange(nameColIndex, Number(e.target.value))}
                    className="w-full bg-[#1e1e24] border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c08028]"
                  >
                    {headers.map((h, idx) => (
                      <option key={idx} value={idx}>{h || `Cột ${idx + 1}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Run config */}
            <div className="flex flex-col gap-3 bg-[#17171d] border border-gray-850 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Tốc độ xử lý (Rate-Limit)
                </span>
                <span className="text-xs bg-[#c08028]/20 text-[#c08028] px-2 py-0.5 rounded font-mono font-bold">
                  {concurrency} Luồng
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Chạy song song giúp tăng tốc độ. Chọn 1 luồng để đảm bảo an toàn tuyệt đối, tránh lỗi nghẽn Gemini quota.
              </p>
              <div className="flex gap-2">
                {[1, 2].map((val) => (
                  <button
                    key={val}
                    type="button"
                    disabled={isRunning}
                    onClick={() => setConcurrency(val)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      concurrency === val 
                        ? "bg-[#c08028] text-white border-[#c08028] shadow-[0_4px_12px_rgba(255,103,31,0.2)]" 
                        : "bg-[#1e1e24] text-gray-400 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {val === 1 ? "Tuần tự (1)" : `Song song (${val})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2 mt-2">
              {!isRunning ? (
                <button
                  onClick={startProcessing}
                  disabled={rows.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-tr from-[#c08028] to-[#ef4029] disabled:from-gray-800 disabled:to-gray-850 hover:opacity-95 text-white disabled:text-gray-500 rounded-xl text-sm font-bold shadow-[0_8px_20px_rgba(255,103,31,0.15)] disabled:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Bắt đầu sinh Prompt bằng AI
                </button>
              ) : (
                <button
                  onClick={stopProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-[0_8px_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Dừng xử lý
                </button>
              )}

              <button
                onClick={downloadResults}
                disabled={rows.length === 0 || successCount === 0}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e1e24] border border-gray-850 hover:border-gray-700 disabled:border-transparent text-gray-300 disabled:text-gray-500 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Tải CSV kết quả ({successCount})
              </button>
            </div>

          </div>
        </div>

        {/* Right Details & Progress Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Progress Status Bar */}
          <div className="bg-[#121216] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Tiến độ công việc
              </h2>
              <span className="text-sm font-semibold text-[#c08028]">
                {currentIndex} / {rows.length} dòng
              </span>
            </div>

            {/* Progress bar line */}
            <div className="w-full bg-gray-900 rounded-full h-3.5 overflow-hidden p-0.5 border border-gray-800">
              <div 
                className="bg-gradient-to-r from-[#c08028] to-[#ef4029] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,103,31,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Status Statistics */}
            <div className="grid grid-cols-3 gap-4 text-center mt-1">
              <div className="bg-[#17171d] border border-gray-850 rounded-xl p-3">
                <span className="text-xs text-gray-500 block">Đã thành công</span>
                <span className="text-lg font-bold text-green-500 mt-0.5 block">{successCount}</span>
              </div>
              <div className="bg-[#17171d] border border-gray-850 rounded-xl p-3">
                <span className="text-xs text-gray-500 block">Bị lỗi</span>
                <span className="text-lg font-bold text-red-500 mt-0.5 block">{failedCount}</span>
              </div>
              <div className="bg-[#17171d] border border-gray-850 rounded-xl p-3">
                <span className="text-xs text-gray-500 block">Tỷ lệ thành công</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {rows.length > 0 ? Math.round((successCount / rows.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Results Table Panel */}
          <div className="bg-[#121216] border border-gray-800 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[450px]">
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Bảng theo dõi và kết quả
              </h2>
              {isRunning && (
                <div className="flex items-center gap-2 text-xs text-[#c08028]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Đang chạy AI...
                </div>
              )}
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto flex-1 max-h-[500px]">
              {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-gray-500 gap-3">
                  <FileText className="w-12 h-12 text-gray-650" />
                  <div>
                    <p className="text-sm font-semibold text-gray-400">Không có dữ liệu hiển thị</p>
                    <p className="text-xs text-gray-500 mt-1">Vui lòng nạp file CSV hoặc bấm nút Tải data mẫu ở bảng điều khiển bên trái.</p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#17171d] border-b border-gray-800 text-gray-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">STT</th>
                      <th className="py-3 px-4 w-32">Khách hàng</th>
                      <th className="py-3 px-4 w-48">Điều tự hào</th>
                      <th className="py-3 px-4 w-28 text-center">Trạng thái</th>
                      <th className="py-3 px-4 w-72">Kết quả AI sinh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-850">
                    {rows.map((row, idx) => (
                      <tr 
                        key={row.id} 
                        className={`hover:bg-[#16161d]/50 transition-colors ${
                          row.status === "running" ? "bg-[#c08028]/5" : ""
                        }`}
                      >
                        <td className="py-4 px-4 font-mono text-center text-gray-500">{row.id}</td>
                        <td className="py-4 px-4 font-bold text-white">{row.name}</td>
                        <td className="py-4 px-4 text-gray-300 whitespace-pre-line leading-relaxed">
                          {row.prideStatement}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.status === "idle" && (
                            <span className="inline-block px-2 py-1 bg-gray-800/60 text-gray-400 rounded-full font-medium border border-gray-750">
                              Chờ xử lý
                            </span>
                          )}
                          {row.status === "running" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#c08028]/10 text-[#c08028] rounded-full font-medium border border-[#c08028]/20 animate-pulse">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              Đang chạy
                            </span>
                          )}
                          {row.status === "success" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full font-medium border border-green-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Xong
                            </span>
                          )}
                          {row.status === "failed" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-400 rounded-full font-medium border border-red-500/20">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Lỗi
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {row.status === "success" ? (
                            <div className="flex flex-col gap-2.5 bg-[#17171d]/60 border border-gray-850 p-3 rounded-xl">
                              
                              <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                                  B4: Insight & Sản phẩm gợi ý
                                </span>
                                <p className="text-gray-300 mt-1 font-medium text-xs leading-relaxed">
                                  <span className="text-[#c08028] font-semibold">{row.visualArchetype}</span>
                                  {" | "}Mối quan tâm: {row.mainInterest}
                                  {" | "}Sản phẩm: <span className="text-yellow-500 font-semibold">{row.product}</span>
                                </p>
                                <div className="mt-1 bg-[#1e1e24] p-2 rounded text-[11px] text-gray-400 border border-gray-800 leading-normal">
                                  <span className="text-gray-500 font-bold">Kịch bản 10 năm: </span>{row.futureScenario}
                                </div>
                              </div>

                              <div className="border-t border-gray-850 pt-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                                  B5: Slogan bìa tạp chí ({row.slogan?.split(" ").length || 0} từ)
                                </span>
                                <p className="text-[#c08028] font-bold text-[13px] mt-1 leading-normal italic">
                                  "{row.slogan}"
                                </p>
                              </div>

                              <div className="border-t border-gray-850 pt-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                                  B6: Prompt mô tả hình ảnh AI (Tiếng Việt)
                                </span>
                                <p className="text-gray-400 mt-1 font-mono text-[11px] leading-relaxed bg-[#191920] p-2 rounded border border-gray-850 select-all whitespace-pre-wrap max-h-24 overflow-y-auto">
                                  {row.imagePrompt}
                                </p>
                              </div>

                            </div>
                          ) : row.status === "failed" ? (
                            <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-400 rounded-xl leading-relaxed text-xs">
                              {row.error}
                            </div>
                          ) : (
                            <span className="text-gray-600 italic">Chưa có kết quả. Hãy bấm chạy.</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

        </div>

      </div>
      
    </div>
  );
}
