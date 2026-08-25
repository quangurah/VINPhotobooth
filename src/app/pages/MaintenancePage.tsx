import React, { useState, useEffect } from "react";
import { Wrench, RefreshCw, Sparkles, Clock, AlertTriangle, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { MAINTENANCE_CONFIG } from "../config/maintenanceConfig";
import imgLogoVinpearlTheatre from "../components/layout/logo_vinpearl_theatre_white_clean.png";
import imgBg from "../../imports/VinPalaceStep1/bg_theater_ocean_city_clean.jpg";

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(MAINTENANCE_CONFIG.systemStatus);

  // Bộ đếm ngược tự động thử làm mới trang
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Khi hết thời gian đếm ngược, thử reload trang nhẹ nhàng
          window.location.reload();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Xử lý khi người dùng bấm nút làm mới thủ công
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setStatusMessage("Đang kiểm tra trạng thái máy chủ...");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#0c0d14] text-white font-['Inter',sans-serif] selection:bg-[#f26f21]/30 selection:text-white">
      {/* Background Image với hiệu ứng lớp phủ Cinematic mờ ảo */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={imgBg}
          alt="Vinpearl Theatre Background"
          className="w-full h-full object-cover object-center scale-105 filter blur-[6px] opacity-25 brightness-50"
        />
        {/* Lớp gradient tối huyền ảo & ánh sáng vàng kim sang trọng */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d14]/90 via-[#0c0d14]/85 to-[#08090d]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-b from-[#f26f21]/15 via-[#c08028]/10 to-transparent blur-[90px] rounded-full" />
      </div>

      {/* Header cố định phía trên */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={imgLogoVinpearlTheatre}
            alt="Vinpearl Theatre Logo"
            className="h-[45px] sm:h-[55px] w-auto object-contain drop-shadow-md"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] sm:text-xs text-amber-300/90 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Bảo trì hệ thống</span>
        </div>
      </header>

      {/* Main Content: Khung thông báo bảo trì trung tâm */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 md:py-10">
        <div className="w-full max-w-[720px] mx-auto">
          {/* Card Glassmorphism */}
          <div className="relative rounded-[24px] sm:rounded-[32px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl text-center overflow-hidden">
            {/* Viền sáng ambient */}
            <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#f26f21] to-transparent opacity-80" />

            {/* Icon minh họa hiệu ứng xoay & phát sáng */}
            <div className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#ec1c24]/20 via-[#f26f21]/25 to-[#c08028]/20 blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-inner">
                <Wrench className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400 animate-[spin_8s_linear_infinite]" />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>

            {/* Badge tiêu đề */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{MAINTENANCE_CONFIG.badgeText}</span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {MAINTENANCE_CONFIG.title}
            </h1>

            {/* Phụ đề thương hiệu */}
            <p className="text-sm sm:text-base font-semibold text-[#f26f21] tracking-wide uppercase mb-5">
              {MAINTENANCE_CONFIG.highlightSubtitle}
            </p>

            {/* Nội dung giải thích */}
            <div className="space-y-3 max-w-[580px] mx-auto text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
              <p>{MAINTENANCE_CONFIG.description}</p>
              <p className="text-xs sm:text-sm text-gray-400 italic">
                {MAINTENANCE_CONFIG.additionalNotice}
              </p>
            </div>

            {/* Box trạng thái tiến độ bảo trì */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 sm:p-5 mb-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-200">
                    {MAINTENANCE_CONFIG.estimatedTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dữ liệu được bảo toàn tuyệt đối</span>
                </div>
              </div>

              {/* Thanh tiến độ Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden relative mb-2">
                <div
                  className="bg-gradient-to-r from-[#ec1c24] via-[#f26f21] to-[#ffba08] h-full rounded-full transition-all duration-1000 relative"
                  style={{ width: `${MAINTENANCE_CONFIG.currentProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite_linear] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:200%_100%]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                <span className="truncate pr-2">{statusMessage}</span>
                <span className="font-bold text-amber-400">{MAINTENANCE_CONFIG.currentProgress}%</span>
              </div>
            </div>

            {/* Khu vực hành động: Nút làm mới & tự động đếm ngược */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ec1c24] via-[#f26f21] to-[#f58220] hover:from-[#d8141c] hover:to-[#e07015] text-white text-sm sm:text-base font-bold shadow-[0_4px_20px_rgba(242,111,33,0.35)] hover:shadow-[0_6px_25px_rgba(242,111,33,0.5)] transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Đang tải lại..." : "Tải lại trang"}</span>
              </button>

              <div className="text-xs text-gray-400 flex items-center gap-1.5 py-1">
                <span>Tự động kiểm tra sau:</span>
                <span className="font-mono font-bold text-amber-300 text-sm px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {countdown}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer thông tin hỗ trợ */}
      <footer className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-6 border-t border-white/10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400/80" />
            <span>{MAINTENANCE_CONFIG.support.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Hotline: <strong className="text-gray-200">{MAINTENANCE_CONFIG.support.hotline}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-400/80" />
            <span>{MAINTENANCE_CONFIG.support.email}</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-500">
          Bản quyền © 2026 Vinpearl Theatre Ocean City × MSB. Trân trọng cảm ơn sự thông cảm của Quý khách.
        </p>
      </footer>
    </div>
  );
}
