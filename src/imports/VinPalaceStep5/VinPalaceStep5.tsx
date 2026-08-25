import Footer from "../../app/components/layout/Footer";
import svgPaths from "./svg-41d4x2cszc";
import imgBg from "./bg_theater_ocean_city_clean.jpg";
import imgLogoMsbCvtWhite1 from "./c6ec0d24b8a4207a7e6fca70124b4af014d9f188.png";
import imgGetItOnGooglePlayBadgeWebColorVietnamese1 from "./3ac909401012fd5310e51918c106ba79f3444bb5.png";
import imgSocialIcon from "./e3306c8635541fed0f99b5892dbacb4ffb3c2d3d.png";
import imgImage5 from "./d6c3f320cb8d9fc41bb2a31b1a330fc20fcbfe3d.png";
import imgFrame31 from "./4e98e8ab2b018af76bbbdd2524c947e7e844ecd4.png";
import imgFlagsViet from "./98f98befd43bf9d5547ecb4ec1ade495c7e9bc11.png";
import imgButtonExit from "./Button_Exit.png";
import imgButtonTiepNoiDiSan1 from "./110ccd213c03f95479a0137a39acbe80ab0fa7da.png";
import imgTapChiDiSanTuongLai from "./tap_chi_di_san_tuong_lai.png";
import { imgGroup } from "./svg-0yv2f";
import { useNavigate, Link } from "react-router";
import Header from "../../app/components/layout/HeaderDiSan";
import * as QRCode from "qrcode";
import React, { useState, useEffect } from "react";

function Bg() {
  return (
    <div className="absolute inset-0 w-full pointer-events-none" data-name="BG">
      <img alt="" className="absolute inset-0 object-top object-cover w-full h-full" src={imgBg} />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1389px] items-start left-0 top-0 w-full">
      <Bg />
    </div>
  );
}

function Group1() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-84.601px_-10.383px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.487 7.25586">
        <g id="Group">
          <path d={svgPaths.p2f9b3e80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-92.965px_2.728px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.01474 5.19705">
        <g id="Group">
          <path d={svgPaths.p1a47e500} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-79.64px_-3.456px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7615 14.8146">
        <g id="Group">
          <path d={svgPaths.p8b9ac00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-86.453px_1.884px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.62235 3.59399">
        <g id="Group">
          <path d={svgPaths.p36a803f0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-77.37px_-1.668px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6954 1.71861">
        <g id="Group">
          <path d={svgPaths.p2a027580} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-73.631px_-2.805px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.72129 8.98124">
        <g id="Group">
          <path d={svgPaths.p376c4300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group7() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-68.596px_-6.314px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2537 16.5257">
        <g id="Group">
          <path d={svgPaths.p2a2683f0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-76.856px_-2.805px] mask-size-[99.986px_23.99px] relative size-full" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.07074 6.35407">
        <g id="Group">
          <path d={svgPaths.p15e10100} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute inset-[23.24%_32.97%_23.23%_56.55%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-56.545px_-5.574px] mask-size-[99.986px_23.99px]" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.4797 12.8417">
        <g id="Group">
          <path d={svgPaths.p2f6c5c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute inset-[22.08%_44.88%_22.08%_45.32%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45.313px_-5.297px] mask-size-[99.986px_23.99px]" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.80396 13.3951">
        <g id="Group">
          <path d={svgPaths.pd6f400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute inset-[23.25%_56.11%_22.75%_31.08%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31.075px_-5.578px] mask-size-[99.986px_23.99px]" style={{ maskImage: `url('${imgGroup}')` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8099 12.9549">
        <g id="Group">
          <path d={svgPaths.p1d770200} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute contents inset-[-11.37%_-0.86%_-15.56%_0]" data-name="Layer-1">
      <div className="absolute flex inset-[43.28%_-0.72%_-15.56%_84.61%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(34.5343cqw,26.8854cqh)] rotate-[-50.26deg] skew-x-[0.24deg] w-[hypot(-65.4657cqw,73.1146cqh)]">
          <Group1 />
        </div>
      </div>
      <div className="absolute flex inset-[-11.37%_-0.86%_78.18%_92.98%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(48.627cqw,44.1135cqh)] rotate-[-47.72deg] skew-x-[0.24deg] w-[hypot(-51.373cqw,55.8865cqh)]">
          <Group2 />
        </div>
      </div>
      <div className="absolute flex inset-[14.4%_0.64%_3.28%_79.65%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(67.7339cqw,-32.5387cqh)] rotate-[-115.52deg] skew-x-[-0.19deg] w-[hypot(32.2661cqw,67.4613cqh)]">
          <Group3 />
        </div>
      </div>
      <div className="absolute flex inset-[-7.86%_5.46%_65.77%_86.46%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(-37.8781cqw,-18.6773cqh)] rotate-[121.43deg] skew-x-[0.21deg] w-[hypot(62.1219cqw,-81.3227cqh)]">
          <Group4 />
        </div>
      </div>
      <div className="absolute flex inset-[6.95%_11.63%_42.29%_77.38%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(11.6993cqw,9.36544cqh)] rotate-[-48.67deg] skew-x-[0.24deg] w-[hypot(-88.3007cqw,90.6346cqh)]">
          <Group5 />
        </div>
      </div>
      <div className="absolute flex inset-[11.69%_17.38%_81.13%_73.64%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-90 -scale-x-100 flex-none h-[100cqw] w-[100cqh]">
          <Group6 />
        </div>
      </div>
      <div className="absolute flex inset-[26.32%_10.66%_-9.83%_68.61%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(74.7984cqw,-28.4698cqh)] rotate-[-110.03deg] skew-x-[-0.16deg] w-[hypot(25.2016cqw,71.5302cqh)]">
          <Group7 />
        </div>
      </div>
      <div className="absolute flex inset-[11.69%_15.06%_61.82%_76.87%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
          <Group8 />
        </div>
      </div>
      <Group9 />
      <Group10 />
      <Group11 />
      <div className="-translate-y-1/2 absolute aspect-[19/11] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-4px] mask-size-[99.986px_23.99px] right-[72%] top-[calc(50%+0.01px)]" style={{ maskImage: `url('${imgGroup}')` }} data-name="Logo MSB_CVT White 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[303.41%] left-[-43.64%] max-w-none top-[-93.77%] w-[323.64%]" src={imgLogoMsbCvtWhite1} />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[-11.37%_-0.86%_-15.56%_0]" data-name="Group">
      <Layer />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Page() {
  return (
    <div className="absolute contents inset-0" data-name="Page-2">
              <img src="/Logo VINPALACE_OK-02.png" className="absolute block inset-0 size-full object-contain" alt="Logo Vin Palace" />
      <div className="hidden"><ClipPathGroup /></div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] leading-[28px] min-w-px not-italic relative text-[24px] text-center text-shadow-[0px_0px_80px_rgba(0,0,0,0.4)] text-white tracking-[2.4px] uppercase">Heritage Magazine</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-[12.36%_15.52%_1.9%_0.15%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 323.832 51.4436">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p2f036b00} fill="var(--fill-0, white)" id="Vector" />
            <path d={svgPaths.p20857800} fill="var(--fill-0, white)" id="Vector_2" />
            <path d={svgPaths.p1ba2af00} fill="var(--fill-0, white)" id="Vector_3" />
            <path d={svgPaths.p14fd5e00} fill="var(--fill-0, white)" id="Vector_4" />
            <path d={svgPaths.p76c3b00} fill="var(--fill-0, white)" id="Vector_5" />
            <path d={svgPaths.p248e3500} fill="var(--fill-0, white)" id="Vector_6" />
          </g>
          <path d={svgPaths.p15907a00} fill="var(--fill-0, white)" id="Vector_7" />
          <path d={svgPaths.p5df7480} fill="var(--fill-0, white)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-[1.92%_0.18%_2.62%_82.35%]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67.0785 57.2746">
        <g filter="url(#filter0_i_1_2869)" id="Group 4">
          <g id="Group 4_2">
            <path d={svgPaths.p2cb58600} fill="url(#paint0_linear_1_2869)" id="Vector" />
            <path d={svgPaths.p11817800} fill="url(#paint1_linear_1_2869)" id="Vector_2" />
          </g>
          <path d={svgPaths.p447e100} fill="var(--fill-0, #c08028)" id="Vector_3" />
          <path d={svgPaths.p26b45e00} fill="var(--fill-0, #FFE082)" id="Vector_4" />
          <path d={svgPaths.p2601b600} fill="url(#paint2_linear_1_2869)" id="Vector_5" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="59.2746" id="filter0_i_1_2869" width="67.0785" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.826883 0 0 0 0 0.446514 0 0 0 0.8 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_2869" />
          </filter>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_2869" x1="13.0412" x2="15.2118" y1="6.31261" y2="57.1969">
            <stop stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_2869" x1="32.0241" x2="34.1946" y1="6.31261" y2="57.1969">
            <stop stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_2869" x1="59.1728" x2="62.7504" y1="17.3051" y2="56.8046">
            <stop stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Layer1() {
  return (
    <div className="h-[60px] relative shrink-0 w-full max-w-[384px] aspect-[384/60] h-auto" data-name="Layer_1">
      <Group12 />
      <Group13 />
    </div>
  );
}

function TpChiDiSnTngLai() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 mt-[40px]" data-name="Vinpearl Theatre Logo Typo">
      <img 
        src="/logo_typo_dnthc_clean.png" 
        className="w-full max-w-[660px] h-auto object-contain shrink-0 relative mx-auto" 
        alt="Vinpearl Theatre Logo Typo" 
      />
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return null;
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full px-[16px] md:px-0">
      <div className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-normal not-italic relative shrink-0 text-[20px] md:text-[24px] text-center text-[#4c2d03] whitespace-normal md:whitespace-nowrap">
        <p className="leading-[28px] md:leading-[32px] mb-0">Chúc mừng! Bạn đã hoàn thành!</p>
        <p className="leading-[24px] md:leading-[28px] text-[16px] md:text-[18px] font-normal text-[#4c2d03]/80">Quét mã QR bên dưới để tải ảnh về máy của bạn</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full max-w-[870px] px-[16px] md:px-0">
      <div className="bg-[rgba(255,255,255,0.85)] relative rounded-[20px] shadow-[0px_12px_24px_0px_rgba(192,128,40,0.3)] shrink-0 w-full backdrop-blur-[12px] p-[24px] md:p-[32px] text-center border border-solid border-[#c08028]/20">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[28px] md:leading-[32px] text-[16px] md:text-[18px] text-black mb-[16px] max-w-[620px] mx-auto">
          Cảm ơn bạn đã trải nghiệm <strong>AI Photobooth</strong> cùng <strong>Vin Palace Theatre</strong>. Hãy chia sẻ bức ảnh đẹp của bạn lên Facebook để lan tỏa khoảnh khắc tuyệt vời này!
        </p>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] md:leading-[32px] text-[17px] md:text-[19px] text-[#c08028] max-w-[620px] mx-auto">
          Chúc bạn có những giây phút thật vui vẻ tại Vin Palace Theatre!
        </p>
      </div>
    </div>
  );
}

function Frame16() {
  const navigate = useNavigate();
  return (
    <div className="content-stretch flex flex-col sm:flex-row gap-[12px] items-center justify-center relative shrink-0 w-full px-[16px] sm:px-0">
      <button 
        onClick={() => navigate('/vinpalacestep1')} 
        className="h-[60px] px-[36px] rounded-[30px] border border-solid border-[#4c2d03] bg-[#4c2d03] text-white hover:bg-[#6b450c] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out font-['Inter:Medium',sans-serif] font-medium text-[20px] outline-none w-full sm:w-auto sm:min-w-[180px]"
      >
        Trang chủ
      </button>
      <button 
        onClick={() => navigate('/vinpalacestep2')} 
        className="content-stretch flex h-[60px] isolate items-center justify-center overflow-clip px-[30px] py-[16px] relative rounded-[30px] shrink-0 cursor-pointer hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300 ease-in-out shadow-[0px_4px_15px_rgba(192,128,40,0.4)] hover:shadow-[0px_8px_25px_rgba(192,128,40,0.6)] w-full sm:w-auto text-center border-none font-['Inter:Medium',sans-serif] font-medium text-[20px] text-white outline-none w-full sm:w-auto sm:min-w-[180px]" 
        style={{ backgroundImage: "linear-gradient(269.96deg, rgb(192, 128, 40) 0%, rgb(212, 175, 55) 50%, rgb(160, 100, 30) 100%)" }}
      >
        Tạo ảnh khác
      </button>
    </div>
  );
}

function QrDownloadSection() {
  const [qrBase64, setQrBase64] = useState("");
  const sessionId = localStorage.getItem("diSanSessionId") || "unknown";
  // Luôn hướng về domain live production để điện thoại quét QR khi chạy thử localhost vẫn tải được ảnh bình thường
  const downloadUrl = `https://vinpalace-df621.web.app/vinpalacedownload?id=${sessionId}`;
  const resultImage = localStorage.getItem("diSanResultImage");

  useEffect(() => {
    QRCode.toDataURL(downloadUrl, {
      width: 250,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    })
      .then(url => {
        setQrBase64(url);
      })
      .catch(err => {
        console.error("[QR Code] Sinh mã thất bại:", err);
      });
  }, [downloadUrl]);

  useEffect(() => {
    if (sessionId && sessionId !== "unknown") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const BASE_URL = isLocal ? "http://127.0.0.1:5001/vinpalace-df621/asia-southeast1/api" : "https://api-phn3coaacq-as.a.run.app";
      
      fetch(`${BASE_URL}/tclife/track-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId,
          action: "download"
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("[TrackAction] Đã ghi nhận lượt tải tự động:", data);
      })
      .catch(err => {
        console.error("[TrackAction] Lỗi khi ghi nhận lượt tải tự động:", err);
      });
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center p-[24px] rounded-[24px] bg-[rgba(255,255,255,0.85)] border border-solid border-[#c08028]/20 shadow-[0px_12px_24px_0px_rgba(192,128,40,0.3)] backdrop-blur-[12px] w-full max-w-[360px] mx-auto text-center shrink-0">
      <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[18px] text-[#c08028] uppercase tracking-[1px] mb-[12px]">Quét QR tải ảnh</h3>
      <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#4a5568] leading-[18px] mb-[16px] max-w-[260px] mx-auto">
        Dùng điện thoại quét mã QR bên dưới để tải trực tiếp ảnh của bạn về máy.
      </p>
      
      <div className="bg-white p-[12px] rounded-[16px] shadow-[0px_0px_20px_rgba(255,255,255,0.15)] flex items-center justify-center mb-[16px] w-[200px] h-[200px] border border-solid border-[#c08028]/20">
        {qrBase64 ? (
          <img src={qrBase64} alt="QR Code" className="size-[176px] object-contain" />
        ) : (
          <div className="text-black/40 text-[14px]">Đang tạo QR...</div>
        )}
      </div>

      {resultImage && (
        <div className="flex items-center gap-[10px] mt-[4px]">
          <div className="size-[48px] rounded-[8px] overflow-hidden border border-solid border-[#c08028]/50">
            <img src={resultImage} alt="Thumbnail preview" className="size-full object-cover" />
          </div>
          <span className="text-[12px] text-black/60 font-['Inter:Medium',sans-serif]">Ảnh của bạn sẵn sàng</span>
        </div>
      )}
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-center relative shrink-0 w-full max-w-[1200px] px-[16px] md:px-0">
      <TpChiDiSnTngLai />
      <Frame17 />
      
      <div className="w-full flex flex-col gap-[30px] items-center justify-center mt-[10px]">
        <div className="w-full max-w-[360px] flex items-center justify-center">
          <QrDownloadSection />
        </div>
        <div className="w-full max-w-[700px] flex flex-col justify-between">
          <Frame22 />
        </div>
      </div>

      <Frame16 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] md:gap-[8px] items-center justify-center pb-[40px] md:pb-[80px] pt-[150px] md:pt-[160px] relative flex-1 w-full">
      <Frame15 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative flex flex-col items-center w-full flex-1">
      <Frame13 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-start px-[16px] md:px-[120px] pt-[90px] md:pt-[148px] w-full gap-[8px]">
      <div className="scale-90 origin-left md:scale-100">
        <ButtonTiepNoiDiSan />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[-33.33%_-83.33%_-133.33%_-83.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <g filter="url(#filter0_d_1_2765)" id="Icon">
            <rect fill="var(--fill-0, #c08028)" fillOpacity="0.5" height="24" rx="12" shapeRendering="crispEdges" width="24" x="20" y="8" />
            <path clipRule="evenodd" d={svgPaths.pdd2d7c0} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="64" id="filter0_d_1_2765" width="64" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="12" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.810134 0 0 0 0 0.429844 0 0 0 0 0.229691 0 0 0 0.5 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_2765" />
              <feBlend in="BackgroundImageFix" in2="effect1_dropShadow_1_2765" mode="normal" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function ButtonTiepNoiDiSan() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/vinpalacestep1')}
      className="h-[60px] px-[36px] rounded-[30px] border border-solid border-[#c08028]/30 bg-[#8b1e1e] text-white hover:bg-[#a32323] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out font-['Inter:Medium',sans-serif] font-medium text-[20px] outline-none shadow-[0px_4px_12px_rgba(139,30,30,0.35)]"
    >
      Thoát
    </button>
  );
}

export default function Component10Step() {
  return (
    <div className="bg-white relative w-full min-h-screen flex flex-col overflow-x-hidden" data-name="10. Step4/1">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Bg />
      </div>
      <div className="relative w-full z-10 flex-1 flex flex-col">
        <Frame14 />
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full">
        <Footer />
      </div>

      <div className="absolute inset-x-0 top-0 z-[9990] pointer-events-none">
        <div className="pointer-events-auto relative max-w-[1440px] mx-auto w-full">
          <Frame19 />
        </div>
      </div>
      
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999]">
        <Header />
      </div>
    </div>
  );
}