import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import imgBg from "../../imports/VinPalaceStep1/bg_theater_ocean_city_clean.jpg";

const BASE_URL = "https://api-phn3coaacq-as.a.run.app";
// Force cache bust: 2026-07-07T15:31:00
export default function DownloadPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Không tìm thấy thông tin phiên chụp ảnh (Session ID).");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/tclife/get-session?sessionId=${sessionId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể kết nối máy chủ để tải hình ảnh.");
        }
        return res.json();
      })
      .then((data) => {
        if (data.ok && data.session) {
          const imgUrl = data.session.finalImageUrl || data.session.cropImageUrl || "";
          if (imgUrl) {
            setImageUrl(imgUrl);
            setUserName(data.session.name || "");
            // Tự động ghi nhận lượt tải = lượt quét QR khi load ảnh thành công
            trackAction("download");
          } else {
            setError("Phiên chụp ảnh không có dữ liệu hình ảnh.");
          }
        } else {
          setError("Không tìm thấy hình ảnh tương ứng với mã số này.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi đường truyền. Vui lòng tải lại trang.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  const trackAction = async (action: "download" | "share") => {
    if (!sessionId) return;
    try {
      await fetch(`${BASE_URL}/tclife/track-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId, action })
      });
    } catch (e) {
      console.error("Lỗi track action (force update v2):", e);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `vinpalace_mag_${userName || "photo"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Tải ảnh thất bại:", e);
      alert("Thiết bị không hỗ trợ tải tự động. Bạn hãy ấn giữ lâu vào ảnh và chọn Lưu hình ảnh.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex flex-col items-center justify-between py-[40px] px-[20px] bg-black text-white selection:bg-[#c08028] selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img alt="" className="w-full h-full object-cover opacity-60" src={imgBg} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center gap-[12px] mb-[30px] w-full">
        <img
          src="/logo_typo_dnthc_clean.png"
          alt="Vinpearl Theatre Logo Typo"
          className="h-[225px] md:h-[282px] w-auto object-contain cursor-pointer"
          onClick={() => navigate("/vinpalacestep1")}
        />
        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-white/60 text-center tracking-[1px] uppercase mt-[10px]">
          Tải ảnh bìa tạp chí di sản nghệ thuật
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-[16px] py-[80px]">
            <div className="size-[50px] border-4 border-solid border-[#c08028]/25 border-t-[#c08028] rounded-full animate-spin" />
            <p className="text-[#c08028] font-['Inter:Medium',sans-serif] text-[16px]">Đang tải hình ảnh của bạn...</p>
          </div>
        ) : error ? (
          <div className="p-[24px] rounded-[24px] bg-red-950/40 border border-solid border-red-500/30 text-center shadow-[0px_0px_20px_rgba(239,68,68,0.15)] backdrop-blur-[12px] w-full">
            <svg className="size-[48px] text-red-500 mx-auto mb-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-['Inter:Medium',sans-serif] text-[16px] text-red-400 mb-[16px]">{error}</p>
            <button
              onClick={() => navigate("/vinpalacestep1")}
              className="h-[50px] px-[24px] rounded-[25px] bg-red-500 text-white font-['Inter:Medium',sans-serif] hover:bg-red-600 transition-all duration-300 cursor-pointer border-none outline-none"
            >
              Quay lại Trang chủ
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-[24px]">
            {/* Image Preview */}
            <div className="relative group rounded-[24px] overflow-hidden border-[6px] border-solid border-[#c08028]/45 shadow-[0px_10px_40px_rgba(192,128,40,0.3)] backdrop-blur-[12px] w-full aspect-[731/1024] bg-neutral-900">
              <img
                src={imageUrl}
                alt="Ảnh bìa tạp chí Vin Palace"
                className="w-full h-full object-contain pointer-events-auto"
              />
            </div>

            {/* Instruction */}
            <div className="text-center max-w-[400px]">
              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-white/70 leading-[22px]">
                👉 <span className="text-[#FFE082] font-semibold">Mẹo dành cho điện thoại:</span> Hãy nhấn giữ lâu vào ảnh ở trên rồi chọn <span className="text-[#FFE082] font-semibold">"Lưu hình ảnh"</span> (Save Image) hoặc bấm nút bên dưới để tải về.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-[16px] w-full justify-center">
              <button
                onClick={handleDownload}
                className="h-[56px] px-[36px] rounded-[28px] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out border-none relative font-['Inter:Bold',sans-serif] font-bold text-[18px] text-white shadow-[0px_4px_15px_rgba(192,128,40,0.4)] hover:brightness-110 outline-none w-full sm:w-auto min-w-[200px]"
                style={{
                  backgroundImage: "linear-gradient(-12.5431deg, rgb(192, 128, 40) 20.897%, rgb(243, 229, 171) 110.29%)",
                }}
              >
                Tải ảnh về
              </button>
              <button
                onClick={() => navigate("/vinpalacestep1")}
                className="h-[56px] px-[36px] rounded-[28px] border border-solid border-[#c08028] bg-transparent text-[#c08028] hover:bg-[#c08028]/10 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out font-['Inter:Medium',sans-serif] font-medium text-[18px] outline-none w-full sm:w-auto min-w-[160px]"
              >
                Trang chủ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 text-[12px] text-white/40 text-center font-['Inter:Regular',sans-serif] mt-[30px] border-t border-solid border-white/10 pt-[20px] w-full max-w-[600px]">
        Bản quyền thuộc sở hữu của Nhà hát Vin Palace © {new Date().getFullYear()}
      </div>
    </div>
  );
}
