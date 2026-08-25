import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import QRCode from "qrcode";

function Bg() {
  return (
    <div className="absolute inset-x-0 bottom-0 -top-[170px] md:top-0 pointer-events-none w-full overflow-hidden" data-name="BG">
      <img 
        alt="Vinpearl Theatre Background" 
        className="absolute inset-0 object-cover object-top w-full h-full scale-[2.0] md:scale-100 origin-top desktop-shift-bg opacity-70" 
        src="/bg_theater_ocean_city_clean.jpg" 
      />
    </div>
  );
}

export default function QrPage() {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    // Sinh mã QR trỏ tới địa chỉ URL hiện tại (trang chủ)
    const targetUrl = window.location.origin;
    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1a1a1a", // Màu tối sẫm giúp camera quét nhạy nhất
        light: "#ffffff",
      },
    })
      .then((url) => {
        setQrUrl(url);
      })
      .catch((err) => {
        console.error("Lỗi khi sinh mã QR:", err);
      });
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden flex flex-col items-center justify-between bg-[#0e0a05] font-['Inter',sans-serif] pb-[30px]">
      {/* Background dùng chung đồng bộ với các trang khác */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Bg />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a05] via-[#0e0a05]/50 to-[#0e0a05]/80" />
      </div>

      {/* Header Logo */}
      <div className="relative z-10 w-full flex justify-center pt-[30px] md:pt-[45px] pb-[10px]">
        <img
          src="/logo_typo_dnthc_clean.png"
          alt="Vinpearl Theatre Logo Typo"
          className="h-[188px] md:h-[243px] w-auto object-contain cursor-pointer drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Main Content Layout - 2 Cột */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-[40px] xl:gap-[80px] w-full max-w-[1200px] px-[24px] py-[20px] flex-1">
        
        {/* Cột 1: Nội dung giới thiệu chương trình */}
        <div className="flex-1 text-left max-w-[550px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[13px] md:text-[14px] text-[#c08028] uppercase tracking-[3px] block mb-[8px]">
            Hành Trình Hóa Thân Độc Bản
          </span>
          <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[28px] md:text-[38px] text-white leading-tight mb-[20px] uppercase">
            AI Photobooth <br className="hidden md:inline" />
            <span className="text-[#c08028]">Kịch Nghệ Hoàng Gia</span>
          </h2>
          <p className="font-normal text-[15px] md:text-[16px] text-white/80 leading-relaxed mb-[30px]">
            Chào mừng bạn đến với không gian nghệ thuật hoàng gia của <strong>Vinpearl Theatre Ocean City</strong>. Công nghệ trí tuệ nhân tạo thông minh sẽ đồng hành phác họa dung mạo và đưa bạn hóa thân trực tiếp vào những nhân vật kịch nghệ tráng lệ nhất.
          </p>

          {/* Các bước tham gia */}
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-start gap-[16px]">
              <div className="size-[32px] rounded-full bg-[#c08028]/20 border border-solid border-[#c08028]/40 flex items-center justify-center shrink-0 text-[#c08028] font-bold text-[14px] mt-[2px]">
                1
              </div>
              <div>
                <h4 className="text-white font-semibold text-[16px] mb-[4px]">Quét mã QR trải nghiệm</h4>
                <p className="text-white/60 text-[14px]">Sử dụng camera điện thoại cá nhân quét mã QR để bắt đầu.</p>
              </div>
            </div>

            <div className="flex items-start gap-[16px]">
              <div className="size-[32px] rounded-full bg-[#c08028]/20 border border-solid border-[#c08028]/40 flex items-center justify-center shrink-0 text-[#c08028] font-bold text-[14px] mt-[2px]">
                2
              </div>
              <div>
                <h4 className="text-white font-semibold text-[16px] mb-[4px]">Cung cấp tên & Chụp ảnh</h4>
                <p className="text-white/60 text-[14px]">Nhập tên của bạn, đồng ý điều khoản và chụp ảnh chân dung hoặc chọn file ảnh có sẵn.</p>
              </div>
            </div>

            <div className="flex items-start gap-[16px]">
              <div className="size-[32px] rounded-full bg-[#c08028]/20 border border-solid border-[#c08028]/40 flex items-center justify-center shrink-0 text-[#c08028] font-bold text-[14px] mt-[2px]">
                3
              </div>
              <div>
                <h4 className="text-white font-semibold text-[16px] mb-[4px]">Lựa chọn vai diễn yêu thích</h4>
                <p className="text-white/60 text-[14px]">Khám phá các phân cảnh chương diễn hoàng gia lộng lẫy và bấm khởi tạo.</p>
              </div>
            </div>

            <div className="flex items-start gap-[16px]">
              <div className="size-[32px] rounded-full bg-[#c08028]/20 border border-solid border-[#c08028]/40 flex items-center justify-center shrink-0 text-[#c08028] font-bold text-[14px] mt-[2px]">
                4
              </div>
              <div>
                <h4 className="text-white font-semibold text-[16px] mb-[4px]">Tải về tác phẩm độc bản</h4>
                <p className="text-white/60 text-[14px]">Nhận và tải trực tiếp bức ảnh bìa tạp chí nghệ thuật độc quyền của riêng bạn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 2: Card chứa QR Code quét thiết bị */}
        <div className="w-full max-w-[420px] bg-[rgba(255,255,255,0.92)] backdrop-blur-[16px] rounded-[30px] p-[28px] md:p-[35px] shadow-[0px_20px_50px_rgba(192,128,40,0.35)] border border-solid border-[#c08028]/30 flex flex-col items-center">
          <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] md:text-[22px] text-[#c08028] uppercase tracking-[2px] mb-[8px] text-center">
            Quét để tham gia
          </h3>
          <p className="font-normal text-[14px] text-[#4a5568] text-center mb-[24px]">
            Quét mã dưới đây bằng điện thoại di động
          </p>

          {/* Khung chứa mã QR Code */}
          <div className="relative bg-white p-[14px] rounded-[24px] shadow-[0px_8px_30px_rgba(0,0,0,0.12)] border border-solid border-gray-100 flex items-center justify-center transition-all duration-300 hover:shadow-[0px_12px_40px_rgba(192,128,40,0.25)] group">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR Code Link Website"
                className="size-[220px] md:size-[240px] block transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="size-[220px] md:size-[240px] flex items-center justify-center">
                <div className="size-[36px] border-4 border-solid border-[#c08028]/25 border-t-[#c08028] rounded-full animate-spin" />
              </div>
            )}
            
            {/* Viền góc nhũ vàng tinh xảo */}
            <div className="absolute top-0 left-0 w-[16px] h-[16px] border-t-2 border-l-2 border-solid border-[#c08028] rounded-tl-[16px]" />
            <div className="absolute top-0 right-0 w-[16px] h-[16px] border-t-2 border-r-2 border-solid border-[#c08028] rounded-tr-[16px]" />
            <div className="absolute bottom-0 left-0 w-[16px] h-[16px] border-b-2 border-l-2 border-solid border-[#c08028] rounded-bl-[16px]" />
            <div className="absolute bottom-0 right-0 w-[16px] h-[16px] border-b-2 border-r-2 border-solid border-[#c08028] rounded-br-[16px]" />
          </div>

          {/* Link chữ dự phòng */}
          <a
            href={window.location.origin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[24px] font-['Inter:Medium',sans-serif] font-medium text-[15px] text-[#4c2d03] hover:text-[#c08028] transition-colors duration-200 underline decoration-dotted underline-offset-4 tracking-[0.5px]"
          >
            {window.location.host}
          </a>
        </div>

      </div>

      {/* Footer bản quyền */}
      <div className="relative z-10 w-full text-center pt-[20px] border-t border-solid border-white/10 max-w-[1200px] mx-auto">
        <p className="text-white/40 text-[11px] tracking-[1px] uppercase">
          Bản quyền © 2026 thuộc về Nhà hát Vinpearl Theatre. Bảo lưu mọi quyền.
        </p>
      </div>
    </div>
  );
}
