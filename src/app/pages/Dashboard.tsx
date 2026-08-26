// e:\vinplacephoto\trang chủ\src\app\pages\Dashboard.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Users, CheckCircle, AlertTriangle, Clock, Search, Filter, 
  Download, Eye, Terminal, RefreshCw, X, ChevronLeft, ChevronRight, Share2, Server, FileText, Image as ImageIcon
} from "lucide-react";

// Định nghĩa base URL trỏ thẳng tới API
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocal ? "http://127.0.0.1:6000/vinpalace-df621/asia-southeast1/api" : "https://api-phn3coaacq-as.a.run.app";

const STYLE_NAMES: Record<string, string> = {
  vinpalace_1: "Hậu duệ rồng tiên",
  vinpalace_2: "Cư dân lúa nước",
  vinpalace_3: "Hào khí Bạch Đằng",
  vinpalace_4: "Trẩy hội non sông",
  vinpalace_5: "Ngày toàn thắng",
  vinpalace_6: "Việt Nam thịnh vượng"
};

const STYLE_COLORS = ["#c08028", "#ef4029", "#ffb81c", "#10b981", "#3b82f6", "#8b5a16"];

interface LogEntry {
  timestamp: string;
  type: "log" | "info" | "warn" | "error";
  message: string;
}

interface Session {
  id: string;
  name: string;
  description: string;
  rawImageUrl: string;
  userPhotoUrl?: string; // Ảnh booth gốc chụp ban đầu của khách hàng
  cropImageUrl: string;
  removebgImageUrl: string;
  finalImageUrl: string;
  qrCodeUrl: string;
  styleId: string;
  logs: LogEntry[];
  renderDuration?: number;
  createdAt: string;
  downloadCount?: number;
  shareCount?: number;
}

interface OverviewData {
  total_jobs: number;
  success_jobs: number;
  failed_jobs: number;
  success_rate: number;
  error_rate: number;
  avg_render_time: number;
  style_counts: Record<string, number>;
  trend_labels: string[];
  trend_values: number[];
  hourly_activity: number[];
  top_users: { name: string; count: number }[];
  total_downloads?: number;
  total_shares?: number;
}

export default function Dashboard() {
  // Tabs chính
  const [activeTab, setActiveTab] = useState<"sessions" | "jobs">("sessions");

  // States cho Overview
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  
  // States cho Sessions Table
  const [sessions, setSessions] = useState<Session[]>([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Filters & Search cho Sessions
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [styleId, setStyleId] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // States cho Jobs Server
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [activeJobModal, setActiveJobModal] = useState<string | null>(null);
  const [activeJobDetail, setActiveJobDetail] = useState<any | null>(null);
  const [loadingJobDetail, setLoadingJobDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<"log" | "llm" | "api" | "result">("log");

  // Modals xem ảnh
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string } | null>(null);
  const [activeLogModal, setActiveLogModal] = useState<{ logs: LogEntry[]; name: string } | null>(null);

  // Fetch Overview Data
  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch(`${BASE_URL}/tclife/dashboard-overview`);
      const data = await res.json();
      if (data.ok) {
        setOverview(data);
      }
    } catch (e) {
      console.error("Lỗi fetch overview:", e);
    } finally {
      setLoadingOverview(false);
    }
  };

  // Fetch Sessions Data
  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        search,
        styleId
      });
      const res = await fetch(`${BASE_URL}/tclife/dashboard-sessions?${queryParams.toString()}`);
      const data = await res.json();
      if (data.ok) {
        setSessions(data.data);
        setMeta({
          currentPage: data.meta.current_page,
          totalPages: data.meta.total_pages,
          totalItems: data.meta.total_items
        });
      }
    } catch (e) {
      console.error("Lỗi fetch sessions:", e);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fetch Jobs Server Data
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch(`${BASE_URL}/tclife/jobs/list`);
      const data = await res.json();
      if (data.ok) {
        setJobs(data.data);
      }
    } catch (e) {
      console.error("Lỗi fetch jobs:", e);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch Job Detail Data
  const fetchJobDetail = async (jobId: string) => {
    setLoadingJobDetail(true);
    try {
      const res = await fetch(`${BASE_URL}/tclife/jobs/detail?jobId=${jobId}`);
      const data = await res.json();
      if (data.ok) {
        setActiveJobDetail(data.data);
      }
    } catch (e) {
      console.error("Lỗi fetch chi tiết job:", e);
    } finally {
      setLoadingJobDetail(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (activeTab === "sessions") {
      fetchSessions();
    } else {
      fetchJobs();
    }
  }, [page, styleId, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSessions();
  };

  // Xuất file CSV toàn bộ dữ liệu (không phân trang)
  const handleExportCSV = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "50000", // Lấy tối đa 50k bản ghi để bao quát toàn bộ
        search,
        styleId
      });
      const res = await fetch(`${BASE_URL}/tclife/dashboard-sessions?${queryParams.toString()}`);
      const data = await res.json();
      if (!data.ok || !data.data || data.data.length === 0) {
        alert("Không có dữ liệu để tải báo cáo!");
        return;
      }

      const headers = ["Mã lượt chơi", "Tên người chơi", "Chủ đề bối cảnh", "Mô tả ý tưởng di sản", "Ảnh chụp gốc", "Tác phẩm ảnh bìa", "Thời gian xử lý (giây)", "Lượt tải tác phẩm", "Lượt chia sẻ tác phẩm", "Thời gian tham gia"];
      const rows = data.data.map((s: any) => [
        s.id || "",
        s.name || "",
        STYLE_NAMES[s.styleId] || s.styleId || "",
        (s.description || "").replace(/"/g, '""'),
        s.userPhotoUrl || s.rawImageUrl || "",
        s.finalImageUrl || "",
        s.renderDuration || "0",
        s.downloadCount || "0",
        s.shareCount || "0",
        s.createdAt ? new Date(s.createdAt).toLocaleString("vi-VN") : ""
      ]);

      const csvContent = 
        "\uFEFF" + 
        [headers.join(","), ...rows.map((e: any) => e.map((val: any) => `"${val}"`).join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Bao_cao_Luot_choi_VinPalace_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Lỗi xuất báo cáo:", e);
      alert("Đã xảy ra lỗi khi tải báo cáo!");
    } finally {
      setIsExporting(false);
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ Recharts
  const getTrendData = () => {
    if (!overview) return [];
    return overview.trend_labels.map((label, idx) => ({
      name: label,
      "Lượt tham gia": overview.trend_values[idx]
    }));
  };

  const getHourlyData = () => {
    if (!overview) return [];
    return overview.hourly_activity.map((val, idx) => ({
      name: `${idx} giờ`,
      "Lượt chơi": val
    }));
  };

  const getStylePieData = () => {
    if (!overview || !overview.style_counts) return [];
    return Object.entries(overview.style_counts)
      .filter(([key]) => STYLE_NAMES[key] !== undefined)
      .map(([key, val]) => ({
        name: STYLE_NAMES[key],
        value: val
      }));
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f7f8f9] font-sans antialiased pb-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-radial-at-t from-[#c08028]/10 via-[#07080a]/0 to-[#07080a] pointer-events-none z-0 min-h-screen" />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8 pt-6 flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-[#c08028]" />
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-[#c08028] bg-clip-text text-transparent">
                GIÁM SÁT HỆ THỐNG VINPALACE
              </h1>
            </div>
            <p className="text-sm text-gray-400 font-medium pl-4">
              Theo dõi lượt tham gia, hoạt động tương tác và trạng thái vận hành của Photobooth
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => { fetchOverview(); fetchSessions(); fetchJobs(); }} 
              className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gray-900 hover:bg-gray-850 active:scale-95 text-white font-bold rounded-xl border border-gray-800 transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-[#c08028]" />
              Làm mới dữ liệu
            </button>
            <Link 
              to="/vinpalacestep1" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 active:scale-95 text-white font-extrabold rounded-xl shadow-lg shadow-[#c08028]/15 transition-all cursor-pointer border-none"
            >
              Vào ứng dụng chơi
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-950/45 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tổng lượt tham gia</span>
              <div className="p-2 rounded-lg bg-[#c08028]/10 text-[#c08028]">
                <Users className="h-5 w-5" />
              </div>
            </div>
            {loadingOverview ? (
              <div className="h-9 w-20 bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-3xl font-black text-white">{overview?.total_jobs || 0}</p>
            )}
            <p className="text-[11px] text-gray-500 font-medium">Số lượt khách hàng mở tương tác</p>
          </div>

          <div className="bg-gray-950/45 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tác phẩm hoàn thành</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            {loadingOverview ? (
              <div className="h-9 w-20 bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-3xl font-black text-emerald-400">{overview?.success_jobs || 0}</p>
            )}
            <p className="text-[11px] text-gray-500 font-medium">Số ảnh tạp chí hoàng gia được tạo</p>
          </div>

          <div className="bg-gray-950/45 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tỷ lệ hoàn thành</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            {loadingOverview ? (
              <div className="h-9 w-20 bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-3xl font-black text-blue-400">{overview?.success_rate || 0}%</p>
            )}
            <p className="text-[11px] text-gray-500 font-medium">Tỷ lệ tạo tác phẩm thành công</p>
          </div>

          <div className="bg-gray-950/45 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Thời gian tạo ảnh</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            {loadingOverview ? (
              <div className="h-9 w-20 bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-3xl font-black text-amber-400">{overview?.avg_render_time || 0} giây</p>
            )}
            <p className="text-[11px] text-gray-500 font-medium">Thời gian xử lý trung bình của AI</p>
          </div>

          <div className="bg-gray-950/45 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Lượt tải tác phẩm</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Download className="h-5 w-5" />
              </div>
            </div>
            {loadingOverview ? (
              <div className="h-9 w-20 bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-3xl font-black text-cyan-400">{overview?.total_downloads || 0}</p>
            )}
            <p className="text-[11px] text-gray-500 font-medium">Số lượt khách hàng tải ảnh về</p>
          </div>

          <div className="bg-gray-950/45 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Lượt chia sẻ tác phẩm</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Share2 className="h-5 w-5" />
              </div>
            </div>
            {loadingOverview ? (
              <div className="h-9 w-20 bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-3xl font-black text-purple-400">{overview?.total_shares || 0}</p>
            )}
            <p className="text-[11px] text-gray-500 font-medium">Số lượt khách hàng chia sẻ QR</p>
          </div>
        </section>

        {/* Tab Selection */}
        <section className="flex gap-2 border-b border-gray-850 pb-1 z-10 relative">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold transition-all cursor-pointer border-b-2 ${
              activeTab === "sessions"
                ? "border-[#c08028] text-[#c08028] bg-gray-900/20"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            Báo cáo lượt chơi & Tương tác
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold transition-all cursor-pointer border-b-2 ${
              activeTab === "jobs"
                ? "border-[#c08028] text-[#c08028] bg-gray-900/20"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Server className="w-4 h-4" />
            Theo dõi hệ thống vận hành
          </button>
        </section>

        {/* Tab 1: Sessions (Firestore Data) */}
        {activeTab === "sessions" && (
          <>
            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-gray-950/30 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Xu hướng tham gia (14 ngày qua)</h3>
                <div className="h-[250px] w-full">
                  {loadingOverview ? (
                    <div className="h-full w-full bg-gray-800/20 animate-pulse rounded-xl" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#0b0c10", border: "1px solid #1f2937", color: "#f3f4f6" }} />
                        <Line type="monotone" dataKey="Lượt tham gia" stroke="#c08028" strokeWidth={3} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-gray-950/30 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Tỷ lệ các chủ đề được yêu thích</h3>
                <div className="h-[200px] w-full flex items-center justify-center">
                  {loadingOverview ? (
                    <div className="h-32 w-32 bg-gray-850 animate-pulse rounded-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getStylePieData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {getStylePieData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STYLE_COLORS[index % STYLE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0b0c10", border: "1px solid #1f2937", color: "#f3f4f6" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {getStylePieData().map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STYLE_COLORS[index % STYLE_COLORS.length] }} />
                      <span className="text-gray-400 font-medium truncate">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5">
              <div className="bg-gray-950/30 backdrop-blur-md border border-gray-850 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Khung giờ hoạt động sôi động nhất trong ngày</h3>
                <div className="h-[250px] w-full">
                  {loadingOverview ? (
                    <div className="h-full w-full bg-gray-850 animate-pulse rounded-xl" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getHourlyData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#0b0c10", border: "1px solid #1f2937", color: "#f3f4f6" }} />
                        <Bar dataKey="Lượt chơi" fill="#ef4029" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            {/* Filters and Search */}
            <section className="bg-gray-950/40 backdrop-blur-md border border-gray-850 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-900/60 border border-gray-800 rounded-xl px-3.5 py-2 w-full md:w-80">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Tìm họ tên, ý tưởng, mã chơi..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500 focus:ring-0"
                />
                <button type="submit" className="hidden" />
              </form>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 px-3.5 py-2 rounded-xl text-sm">
                  <Filter className="h-3.5 w-3.5 text-gray-400" />
                  <select 
                    value={styleId} 
                    onChange={(e) => { setStyleId(e.target.value); setPage(1); }}
                    className="bg-transparent border-none text-white outline-none cursor-pointer pr-4"
                  >
                    <option value="">Tất cả chủ đề</option>
                    {Object.entries(STYLE_NAMES).map(([key, name]) => (
                      <option key={key} value={key} className="bg-gray-900">{name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleExportCSV} 
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#c08028]/10 text-[#c08028] hover:bg-[#c08028]/20 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? "Đang tải..." : "Tải Báo cáo (Excel)"}
                </button>
              </div>
            </section>

            {/* Sessions Table */}
            <section className="bg-gray-950/20 border border-gray-850 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/40 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <th className="py-4 px-5">Người chơi</th>
                      <th className="py-4 px-5">Chủ đề bối cảnh</th>
                      <th className="py-4 px-5 max-w-[250px] truncate">Ý tưởng di sản</th>
                      <th className="py-4 px-5">Hình ảnh (Chụp & Tác phẩm)</th>
                      <th className="py-4 px-5">Xử lý</th>
                      <th className="py-4 px-5">Lượt tải</th>
                      <th className="py-4 px-5">Lượt chia sẻ</th>
                      <th className="py-4 px-5">Thời gian tham gia</th>
                      <th className="py-4 px-5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSessions ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b border-gray-850/50 bg-gray-900/10">
                          <td className="py-4 px-5"><div className="h-4 w-28 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-44 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-10 w-24 bg-gray-800 animate-pulse rounded-lg" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-12 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-8 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-8 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-8 w-24 bg-gray-800 animate-pulse rounded-md ml-auto" /></td>
                        </tr>
                      ))
                    ) : sessions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-500 font-medium text-sm">
                          Chưa ghi nhận lượt chơi nào trên hệ thống.
                        </td>
                      </tr>
                    ) : (
                      sessions.map((s) => (
                        <tr key={s.id} className="border-b border-gray-850/30 hover:bg-gray-900/10 transition-colors text-sm">
                          <td className="py-4 px-5 font-bold text-white">
                            <div className="flex flex-col gap-0.5">
                              <span>{s.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono select-all font-normal">{s.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 bg-gray-900 border border-gray-800 rounded-lg text-xs font-bold text-gray-300">
                              {STYLE_NAMES[s.styleId] || s.styleId}
                            </span>
                          </td>
                          <td className="py-4 px-5 max-w-[250px] truncate text-gray-350" title={s.description}>
                            {s.description}
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              {/* Thumbnail Ảnh Gốc */}
                              {(s.userPhotoUrl || s.rawImageUrl) ? (
                                <div 
                                  onClick={() => setActivePhotoModal({ url: s.userPhotoUrl || s.rawImageUrl, title: `Ảnh chụp gốc - ${s.name}` })}
                                  className="w-10 h-12 rounded border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-500 transition-all shrink-0 relative group"
                                  title="Click để phóng to ảnh chụp gốc"
                                >
                                  <img src={s.userPhotoUrl || s.rawImageUrl} alt="Original" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Eye className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-10 h-12 rounded border border-gray-800 bg-gray-900 flex items-center justify-center text-gray-700 shrink-0" title="Không có ảnh gốc">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                              
                              {/* Thumbnail Ảnh Tạp Chí */}
                              {s.finalImageUrl ? (
                                <div 
                                  onClick={() => setActivePhotoModal({ url: s.finalImageUrl, title: `Tác phẩm Tạp chí - ${s.name}` })}
                                  className="w-10 h-12 rounded border border-[#c08028]/50 overflow-hidden cursor-pointer hover:border-[#c08028] transition-all shrink-0 relative group"
                                  title="Click để phóng to ảnh tạp chí"
                                >
                                  <img src={s.finalImageUrl} alt="Magazine" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Eye className="w-3 h-3 text-[#c08028]" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-10 h-12 rounded border border-gray-800 bg-gray-900 flex items-center justify-center text-gray-700 shrink-0" title="Đang xử lý/Không thành công">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-5 text-sm font-bold text-amber-500">
                            {s.renderDuration ? `${s.renderDuration}s` : "N/A"}
                          </td>
                          <td className="py-4 px-5 text-sm font-bold text-cyan-400">
                            {s.downloadCount || 0}
                          </td>
                          <td className="py-4 px-5 text-sm font-bold text-purple-400">
                            {s.shareCount || 0}
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-400">
                            {s.createdAt ? new Date(s.createdAt).toLocaleString("vi-VN") : "N/A"}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button 
                              onClick={() => setActiveLogModal({ logs: s.logs || [], name: s.name })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                            >
                              <Terminal className="h-3.5 w-3.5 text-[#c08028]" />
                              Nhật ký xử lý
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loadingSessions && meta.totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 bg-gray-950/40 border-t border-gray-850/80">
                  <span className="text-xs text-gray-500 font-semibold">
                    Hiển thị trang {meta.currentPage}/{meta.totalPages} ({meta.totalItems} kết quả)
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      className="p-1.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      disabled={page === meta.totalPages}
                      onClick={() => setPage(prev => Math.min(prev + 1, meta.totalPages))}
                      className="p-1.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* Tab 2: Jobs (Server Log / Technical Monitor) */}
        {activeTab === "jobs" && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center bg-gray-950/30 border border-gray-850 rounded-2xl p-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Theo dõi tiến độ xử lý của máy chủ</h3>
                <p className="text-xs text-gray-500">Giám sát các hàng đợi và tiến trình tạo ảnh thực tế đang chạy trên server</p>
              </div>
              <button
                onClick={fetchJobs}
                className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-bold rounded-xl border border-gray-800 transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 text-[#c08028]" /> Làm mới tiến trình
              </button>
            </div>

            <section className="bg-gray-950/20 border border-gray-850 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-850 bg-gray-900/40 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <th className="py-4 px-5">Mã lượt chơi</th>
                      <th className="py-4 px-5">Trạng thái xử lý</th>
                      <th className="py-4 px-5">Người chơi</th>
                      <th className="py-4 px-5">Chủ đề bối cảnh</th>
                      <th className="py-4 px-5">Tác phẩm</th>
                      <th className="py-4 px-5">Cập nhật lúc</th>
                      <th className="py-4 px-5 text-right">Nhật ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingJobs ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b border-gray-850/50 bg-gray-900/10">
                          <td className="py-4 px-5"><div className="h-4 w-44 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-5 w-16 bg-gray-800 animate-pulse rounded-full" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-28 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-6 w-16 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-800 animate-pulse rounded-md" /></td>
                          <td className="py-4 px-5"><div className="h-8 w-24 bg-gray-800 animate-pulse rounded-md ml-auto" /></td>
                        </tr>
                      ))
                    ) : jobs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500 font-medium text-sm">
                          Không ghi nhận được tiến trình nào trong lịch sử vận hành.
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job) => (
                        <tr key={job.jobId} className="border-b border-gray-850/30 hover:bg-gray-900/10 transition-colors text-sm">
                          <td className="py-4 px-5 font-semibold text-white font-mono select-all">{job.jobId}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                              job.status === "SUCCESS" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" :
                              job.status === "FAILED" ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" :
                              job.status === "RUNNING" ? "bg-blue-500/10 border border-blue-500/30 text-blue-400" :
                              "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                            }`}>
                              {job.status === "SUCCESS" ? "Thành công" :
                               job.status === "FAILED" ? "Gặp lỗi" :
                               job.status === "RUNNING" ? "Đang tạo ảnh" : "Đang chờ"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-300 font-bold">{job.name || "Khách"}</td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 bg-gray-900 border border-gray-800 rounded-lg text-xs font-bold text-gray-400">
                              {STYLE_NAMES[job.conceptId] || job.conceptId || "Chưa chọn"}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            {job.finalImageUrl ? (
                              <div className="flex items-center gap-2">
                                {/* Thumbnail Nhỏ của Tác Phẩm */}
                                <div 
                                  onClick={() => setActivePhotoModal({ url: job.finalImageUrl, title: `Tác phẩm - ${job.name || "Khách"}` })}
                                  className="w-10 h-12 rounded border border-[#c08028]/50 overflow-hidden cursor-pointer hover:border-[#c08028] transition-all relative group"
                                  title="Phóng to ảnh tạp chí"
                                >
                                  <img src={job.finalImageUrl} alt="Tạp chí" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Eye className="w-3 h-3 text-[#c08028]" />
                                  </div>
                                </div>
                                {job.fallbackTriggered && (
                                  <span className="text-[10px] bg-rose-950/40 text-rose-400 px-1.5 py-0.5 rounded font-bold border border-rose-900/30" title="Hệ thống đã tự động ghép ảnh người lên hình bối cảnh do Imagen gặp sự cố">
                                    Tự ghép nền
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs italic">Không có tác phẩm</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-400">
                            {new Date(job.updatedAt).toLocaleString("vi-VN")}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => { setActiveJobModal(job.jobId); fetchJobDetail(job.jobId); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                            >
                              <Terminal className="h-3.5 w-3.5 text-[#c08028]" />
                              Chi tiết vận hành
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

      </div>

      {/* Modal Xem ảnh */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden max-w-[500px] w-full shadow-2xl relative">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800 bg-gray-900/60">
              <h4 className="text-sm font-bold text-[#c08028] uppercase">{activePhotoModal.title}</h4>
              <button 
                onClick={() => setActivePhotoModal(null)}
                className="text-gray-550 hover:text-white p-1 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 flex justify-center items-center bg-black/30 max-h-[70vh] overflow-y-auto">
              <img 
                src={activePhotoModal.url} 
                alt="Preview" 
                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-gray-850 shadow-md"
              />
            </div>
            <div className="px-5 py-3 border-t border-gray-800 bg-gray-900/60 text-right">
              <a 
                href={activePhotoModal.url} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 text-white text-xs font-bold rounded-lg transition-all border-none"
                style={{ textDecoration: 'none' }}
              >
                <Eye className="h-3.5 w-3.5" />
                Mở ảnh lớn trong tab mới
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem Log Terminal (Firestore Logs) */}
      {activeLogModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden max-w-[800px] w-full shadow-2xl relative">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-850 bg-gray-900/60">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-5 w-5 text-[#c08028]" />
                <h4 className="text-sm font-bold text-white uppercase">Nhật ký xử lý của người chơi: {activeLogModal.name}</h4>
              </div>
              <button 
                onClick={() => setActiveLogModal(null)}
                className="text-gray-500 hover:text-white p-1 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 bg-black/50 h-[60vh] overflow-y-auto font-mono text-xs flex flex-col gap-1.5 select-text">
              {activeLogModal.logs.length === 0 ? (
                <p className="text-gray-650 italic py-6 text-center">Không ghi nhận hoạt động nào của phiên tương tác này.</p>
              ) : (
                activeLogModal.logs.map((log, index) => {
                  let colorClass = "text-gray-300";
                  if (log.type === "warn") colorClass = "text-amber-400";
                  if (log.type === "error") colorClass = "text-rose-500 font-semibold";
                  if (log.type === "info") colorClass = "text-blue-400";
                  
                  // Dịch nghĩa thông báo
                  let translatedMsg = log.message;
                  if (translatedMsg.includes("generate-magazine-image")) translatedMsg = translatedMsg.replace("generate-magazine-image", "Tạo ảnh tạp chí AI");
                  if (translatedMsg.includes("analyze-insight-image")) translatedMsg = translatedMsg.replace("analyze-insight-image", "Nhận diện chân dung");
                  if (translatedMsg.includes("remove-bg")) translatedMsg = translatedMsg.replace("remove-bg", "Tách nền chân dung");
                  if (translatedMsg.includes("succeeded")) translatedMsg = translatedMsg.replace("succeeded", "thành công");
                  if (translatedMsg.includes("failed")) translatedMsg = translatedMsg.replace("failed", "gặp sự cố");

                  return (
                    <div key={index} className="flex items-start gap-3 border-b border-gray-900 pb-1">
                      <span className="text-gray-600 shrink-0 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString("vi-VN", { hour12: false })}
                      </span>
                      <span className={`px-1 rounded bg-gray-900 font-bold tracking-wide uppercase shrink-0 text-[9px] ${
                        log.type === "error" ? "bg-rose-950/40 text-rose-400" : 
                        log.type === "warn" ? "bg-amber-950/40 text-amber-400" :
                        "text-gray-500"
                      }`}>
                        {log.type === "error" ? "Lỗi" : log.type === "warn" ? "Chú ý" : "Tiến trình"}
                      </span>
                      <p className={`whitespace-pre-wrap break-all flex-1 ${colorClass}`}>
                        {translatedMsg}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết Job Server (LOG PHIÊN KỸ THUẬT) */}
      {activeJobModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden max-w-[1000px] w-full shadow-2xl relative">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-850 bg-gray-900/60">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-5 w-5 text-[#c08028]" />
                <h4 className="text-sm font-bold text-white uppercase font-sans">Chi tiết Nhật ký: {activeJobModal}</h4>
              </div>
              <button 
                onClick={() => { setActiveJobModal(null); setActiveJobDetail(null); }}
                className="text-gray-550 hover:text-white p-1 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingJobDetail || !activeJobDetail ? (
              <div className="h-[65vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-8 w-8 text-[#c08028] animate-spin" />
                  <span className="text-sm text-gray-400 font-sans font-bold">Đang truy xuất dữ liệu tiến trình...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[70vh]">
                {/* Job Tab Menu */}
                <div className="flex bg-gray-900/40 px-5 border-b border-gray-850 text-xs font-sans">
                  <button
                    onClick={() => setActiveDetailTab("log")}
                    className={`px-4 py-3 font-bold transition-all border-b-2 cursor-pointer ${
                      activeDetailTab === "log" ? "border-[#c08028] text-[#c08028]" : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Lịch sử tiến trình xử lý
                  </button>
                  <button
                    onClick={() => setActiveDetailTab("llm")}
                    className={`px-4 py-3 font-bold transition-all border-b-2 cursor-pointer ${
                      activeDetailTab === "llm" ? "border-[#c08028] text-[#c08028]" : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Ý tưởng & Prompt AI ({activeJobDetail.llmCalls?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveDetailTab("api")}
                    className={`px-4 py-3 font-bold transition-all border-b-2 cursor-pointer ${
                      activeDetailTab === "api" ? "border-[#c08028] text-[#c08028]" : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Kết nối dịch vụ máy chủ ({activeJobDetail.apiCalls?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveDetailTab("result")}
                    className={`px-4 py-3 font-bold transition-all border-b-2 cursor-pointer ${
                      activeDetailTab === "result" ? "border-[#c08028] text-[#c08028]" : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Dữ liệu đầu ra
                  </button>
                </div>

                {/* Job Tab Content */}
                <div className="flex-1 p-5 bg-[#050608] overflow-y-auto font-mono text-xs select-text">
                  
                  {/* Console logs */}
                  {activeDetailTab === "log" && (
                    <div className="flex flex-col gap-1">
                      {!activeJobDetail.logContent ? (
                        <span className="text-gray-600 italic font-sans">Không ghi nhận được thông số lịch sử nào.</span>
                      ) : (
                        activeJobDetail.logContent.split("\n").map((line: string, i: number) => {
                          let colorClass = "text-gray-300";
                          if (line.includes("Error") || line.includes("failed") || line.includes("FAILED")) {
                            colorClass = "text-rose-500 font-semibold";
                          } else if (line.includes("timeout") || line.includes("Fallback") || line.includes("warn")) {
                            colorClass = "text-amber-400";
                          } else if (line.includes("succeeded") || line.includes("success") || line.includes("SUCCESS") || line.includes("thành công")) {
                            colorClass = "text-emerald-400";
                          } else if (line.includes("[DEBUG]")) {
                            colorClass = "text-blue-400";
                          }

                          // Việt hóa nhanh cho dễ đọc
                          let formattedLine = line;
                          if (formattedLine.includes("generate-magazine-image")) formattedLine = formattedLine.replace("generate-magazine-image", "Tạo ảnh Tạp chí");
                          if (formattedLine.includes("remove-bg")) formattedLine = formattedLine.replace("remove-bg", "Tách ảnh nền");
                          if (formattedLine.includes("analyze-insight-image")) formattedLine = formattedLine.replace("analyze-insight-image", "Phân tích thần thái khuôn mặt");

                          return <div key={i} className={`whitespace-pre-wrap break-all ${colorClass}`}>{formattedLine}</div>;
                        })
                      )}
                    </div>
                  )}

                  {/* LLM calls */}
                  {activeDetailTab === "llm" && (
                    <div className="flex flex-col gap-4">
                      {activeJobDetail.llmCalls?.length === 0 ? (
                        <span className="text-gray-600 italic font-sans">Không ghi nhận thông tin gọi AI.</span>
                      ) : (
                        activeJobDetail.llmCalls.map((call: any, idx: number) => (
                          <div key={idx} className="bg-gray-950 border border-gray-850 rounded-xl p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-b border-gray-900 pb-2 font-sans">
                              <span>Thời gian: {new Date(call.timestamp).toLocaleString("vi-VN")}</span>
                              <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded uppercase">Google Gemini AI</span>
                            </div>
                            <div className="text-xs">
                              <p className="text-[#c08028] font-bold font-sans">Từ khóa Prompt bối cảnh gửi lên AI:</p>
                              <pre className="bg-black/60 p-2.5 rounded-lg border border-gray-900 overflow-x-auto text-gray-300 whitespace-pre-wrap font-mono mt-1 select-all">{call.prompt}</pre>
                            </div>
                            <div className="text-xs mt-2">
                              <p className="text-emerald-400 font-bold font-sans">Kết quả phản hồi từ AI:</p>
                              <pre className="bg-black/60 p-2.5 rounded-lg border border-gray-900 overflow-x-auto text-gray-300 whitespace-pre-wrap font-mono mt-1 select-all">
                                {typeof call.response === 'object' ? JSON.stringify(call.response, null, 2) : call.response}
                              </pre>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* API calls */}
                  {activeDetailTab === "api" && (
                    <div className="flex flex-col gap-4 font-sans">
                      {activeJobDetail.apiCalls?.length === 0 ? (
                        <span className="text-gray-600 italic font-sans">Không ghi nhận được cuộc gọi máy chủ nào.</span>
                      ) : (
                        activeJobDetail.apiCalls.map((call: any, idx: number) => (
                          <div key={idx} className="bg-gray-950 border border-gray-850 rounded-xl p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-b border-gray-900 pb-2">
                              <span>Thời gian: {new Date(call.timestamp).toLocaleString("vi-VN")}</span>
                              <span className="bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded uppercase font-mono">Dịch vụ: {call.apiName}</span>
                            </div>
                            <div className="text-xs">
                              <p className="text-gray-400 font-bold">Tham số đầu vào:</p>
                              <pre className="bg-black/60 p-2.5 rounded-lg border border-gray-900 overflow-x-auto text-gray-300 font-mono mt-1 select-all">{JSON.stringify(call.request, null, 2)}</pre>
                            </div>
                            <div className="text-xs mt-2">
                              <p className="text-emerald-400 font-bold">Dữ liệu máy chủ trả về:</p>
                              <pre className="bg-black/60 p-2.5 rounded-lg border border-gray-900 overflow-x-auto text-gray-300 font-mono mt-1 select-all">{JSON.stringify(call.response, null, 2)}</pre>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Result JSON */}
                  {activeDetailTab === "result" && (
                    <div>
                      {!activeJobDetail.result || Object.keys(activeJobDetail.result).length === 0 ? (
                        <span className="text-gray-650 italic font-sans">Chưa có tệp tin kết quả nào được khởi tạo.</span>
                      ) : (
                        <div className="bg-gray-950 border border-gray-850 rounded-xl p-4 font-sans">
                          <p className="text-xs text-gray-400 font-bold mb-2">Thông số tệp đầu ra thô:</p>
                          <pre className="bg-black/60 p-3 rounded-lg border border-gray-900 text-gray-350 overflow-x-auto font-mono select-all">{JSON.stringify(activeJobDetail.result, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
