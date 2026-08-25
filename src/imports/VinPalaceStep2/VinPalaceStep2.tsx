import Footer from "../../app/components/layout/Footer";
import Header from "../../app/components/layout/HeaderDiSan";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import svgPaths from "./svg-d5tj5bhfre";
import imgBg from "./bg_theater_ocean_city_clean.jpg";
import imgButtonActive from "./ButtonActive.png";
import imgButtonDisabled from "./ButtonDisabled.png";
import imgLogoMsbCvtWhite1 from "./c6ec0d24b8a4207a7e6fca70124b4af014d9f188.png";
import imgGetItOnGooglePlayBadgeWebColorVietnamese1 from "./3ac909401012fd5310e51918c106ba79f3444bb5.png";
import imgSocialIcon from "./e3306c8635541fed0f99b5892dbacb4ffb3c2d3d.png";
import imgImage5 from "./d6c3f320cb8d9fc41bb2a31b1a330fc20fcbfe3d.png";
import imgFrame31 from "./4e98e8ab2b018af76bbbdd2524c947e7e844ecd4.png";
import imgFlagsViet from "./98f98befd43bf9d5547ecb4ec1ade495c7e9bc11.png";
import imgButtonExit from "./Button_Exit.png";
import { imgGroup } from "./svg-c29np";
import imgTapChiDiSanTuongLai from "./tap-chi-di-san-tuong-lai.png";
import imgCardButton from "./CardButton.png";
import imgButtonStructure from "./ButtonStructure.png";

function Bg() {
  return (
    <div className="absolute inset-x-0 bottom-0 -top-[170px] md:top-0 pointer-events-none w-full overflow-hidden" data-name="BG">
      <img alt="" className="absolute inset-0 object-cover object-top w-full h-full scale-[2.0] md:scale-100 origin-top desktop-shift-bg" src={imgBg} />
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
          <path d={svgPaths.p19368b00} fill="var(--fill-0, white)" id="Vector" />
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
      <img src="/logo_vinpearl_theatre_color_clean.png" className="absolute block inset-0 size-full object-contain" alt="Logo Vinpearl Theatre" />
      <div className="hidden"><ClipPathGroup /></div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-[2.75%_18.91%_-0.01%_0]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 265.974 46.6829">
        <g id="Group">
          <path d={svgPaths.p19708d00} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p14bbff80} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p1f47dc70} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p3cbcb300} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p35a21600} fill="var(--fill-0, white)" id="Vector_5" />
          <path d={svgPaths.p2b2a4600} fill="var(--fill-0, white)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-[0_0_0.7%_82.16%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.5079 47.6604">
        <g id="Group">
          <path d={svgPaths.p3704ab00} fill="var(--fill-0, #FFB81C)" id="Vector" />
          <path d={svgPaths.p1e03cf00} fill="var(--fill-0, #FFB81C)" id="Vector_2" />
          <path d={svgPaths.p11593580} fill="var(--fill-0, #FFB81C)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function TươngLai() {
  return (
    <div className="h-[48px] overflow-clip relative shrink-0 w-[328px]" data-name="T� �� �NG LAI">
      <Group12 />
      <Group13 />
    </div>
  );
}

function Frame20() {
  return (
    <img
      alt="Vinpearl Theatre Logo Typo"
      className="w-full max-w-[660px] h-auto object-contain shrink-0 relative mx-auto my-[40px]"
      src="/logo_typo_dnthc_clean.png"
    />
  );
}

function OverlayBorderOverlayBlur() {
  return null;
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
      <OverlayBorderOverlayBlur />
    </div>
  );
}

function AddImage() {
  return (
    <div className="relative shrink-0 size-[66px]" data-name="add-image 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
        <g clipPath="url(#clip0_1_3952)" id="add-image 1">
          <path d={svgPaths.p95cf80} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3952">
            <rect fill="white" height="60" width="60" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[31px] not-italic relative shrink-0 text-[22px] text-center text-[#4c2d03] w-full">Tải ảnh của bạn lên*</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <Frame26 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
      <Frame17 />
    </div>
  );
}

const resizeAndCompressImage = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

function Upload({ preview, setPreview }: { preview: string | null, setPreview: (s: string | null) => void }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      setCountdown(5);
    } catch (err) {
      console.error("Lỗi khi mở camera:", err);
      alert("Không thể truy cập camera. Vui lòng cấp quyền truy cập camera cho trình duyệt!");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement("canvas");
      let cropWidth, cropHeight;
      if (video.videoWidth / video.videoHeight > 3 / 4) {
        // Video is wider than 3:4 (standard landscape webcam stream)
        cropHeight = video.videoHeight;
        cropWidth = video.videoHeight * 3 / 4;
      } else {
        // Video is taller than 3:4
        cropWidth = video.videoWidth;
        cropHeight = video.videoWidth * 4 / 3;
      }
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const startX = (video.videoWidth - cropWidth) / 2;
        const startY = (video.videoHeight - cropHeight) / 2;
        // Lật gương canvas để ảnh chụp ra giống hệt preview trên màn hình
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPreview(dataUrl);
      }
      stopCamera();
    }
  };

  const handleManualCapture = () => {
    setCountdown(null);
    capturePhoto();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const compressedBase64 = await resizeAndCompressImage(file);
      setPreview(compressedBase64);
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      capturePhoto();
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    if (!preview && !isCameraActive) {
      startCamera();
    }
  }, [preview, isCameraActive]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div
      className={`backdrop-blur-[12px] bg-[rgba(192,128,40,0.2)] content-stretch flex flex-col items-center p-[22px] relative rounded-[22px] shadow-[0px_12px_20px_0px_rgba(192,128,40,0.4)] shrink-0 w-full max-w-[500px] transition-all duration-300 overflow-hidden ${preview || isCameraActive ? 'h-auto gap-[22px]' : 'min-h-[211px] justify-center gap-[26px]'
        }`}
      data-name="UPLOAD"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {preview ? (
        <div className="w-full flex flex-col items-center gap-[20px]">
          <div className="w-full rounded-[12px] overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-auto block" />
          </div>
          <button
            onClick={() => setPreview(null)}
            className="z-20 w-fit hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out border-none bg-transparent cursor-pointer"
          >
            <img src={imgCardButton} alt="Đổi ảnh" className="h-[38px] w-auto pointer-events-none" />
          </button>
        </div>
      ) : isCameraActive ? (
        <div className="w-full flex flex-col items-center gap-[20px]">
          <div className="w-full aspect-[3/4] rounded-[12px] overflow-hidden bg-black relative flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-30 pointer-events-none">
                <div
                  key={countdown}
                  className="text-[120px] md:text-[150px] font-['Inter:Bold',sans-serif] font-bold text-white drop-shadow-[0_6px_15px_rgba(0,0,0,0.7)] animate-in zoom-in-50 duration-300"
                >
                  {countdown}
                </div>
                <p className="text-white text-[16px] md:text-[18px] font-semibold uppercase tracking-[2px] mt-[10px] drop-shadow-lg">
                  Chuẩn bị chụp...
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-[10px] w-full justify-center z-20">
            <button
              onClick={handleManualCapture}
              className="px-[16px] py-[10px] bg-[#4c2d03] text-white font-bold rounded-[20px] border-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 text-xs min-w-[100px]"
            >
              Chụp ngay
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-[16px] py-[10px] bg-[#c08028] text-white font-bold rounded-[20px] border-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 text-xs min-w-[100px]"
            >
              Tải ảnh lên
            </button>
            <button
              onClick={stopCamera}
              className="px-[16px] py-[10px] bg-red-800 text-white font-bold rounded-[20px] border-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 text-xs min-w-[100px]"
            >
              Tắt camera
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-[24px] pointer-events-auto">
          <div className="w-full flex flex-col items-center gap-[12px]">
            <AddImage />
            <Frame16 />
          </div>

          <div className="flex flex-row gap-[16px] w-full justify-center z-20">
            <button
              onClick={startCamera}
              className="px-[20px] py-[12px] bg-[#c08028] text-white font-bold rounded-[30px] border-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 text-sm min-w-[140px] shadow-[0px_4px_10px_rgba(192,128,40,0.3)]"
            >
              Kích hoạt camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-[20px] py-[12px] bg-[#4c2d03] text-white font-bold rounded-[30px] border-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 text-sm min-w-[140px] shadow-[0px_4px_10px_rgba(76,45,3,0.3)]"
            >
              Tải ảnh lên
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Frame11({ name, setName }: { name: string, setName: (n: string) => void }) {
  return (
    <div className="bg-white flex-[1_0_0] h-[64px] min-w-px relative rounded-[13px] px-[22px] shadow-sm">
      <div aria-hidden="true" className="absolute border border-solid border-gray-100 inset-0 pointer-events-none rounded-[13px]" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={14}
        className="relative z-10 w-full h-full bg-transparent outline-none text-[#091E42] text-[18px] font-['Inter:Regular',sans-serif] placeholder-[#999]"
        placeholder="Nhập tên của bạn*"
      />
    </div>
  );
}

function Frame21({ name, setName }: { name: string, setName: (n: string) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[9px] h-[132px] items-center min-w-px relative">
      <Frame11 name={name} setName={setName} />
    </div>
  );
}

function Frame18({ name, setName }: { name: string, setName: (n: string) => void }) {
  return (
    <div className="content-stretch flex h-[132px] items-start justify-center relative shrink-0 w-full max-w-[500px]">
      <Frame21 name={name} setName={setName} />
    </div>
  );
}

function InputTen({ name, setName }: { name: string, setName: (n: string) => void }) {
  return (
    <div className="backdrop-blur-[12px] bg-[rgba(192,128,40,0.2)] content-stretch flex flex-col h-[89px] items-center justify-center px-[22px] relative rounded-[22px] shadow-[0px_12px_20px_0px_rgba(192,128,40,0.4)] shrink-0 w-full max-w-[500px]" data-name="INPUT_Tên">
      <Frame18 name={name} setName={setName} />
    </div>
  );
}

function Frame22({ preview, setPreview }: { preview: string | null, setPreview: (s: string | null) => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-center relative shrink-0 w-full max-w-[500px]">
      <Upload preview={preview} setPreview={setPreview} />
    </div>
  );
}

function Frame23({ isNextActive, onNext }: { isNextActive: boolean, onNext: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0">
      <button
        onClick={() => navigate('/vinpalacestep1')}
        className="h-[60px] px-[30px] rounded-[30px] border border-solid border-[#4c2d03] bg-[#4c2d03] text-white hover:bg-[#6b450c] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out font-['Inter:Medium',sans-serif] font-medium text-[20px] outline-none"
      >
        Quay lại
      </button>
      {isNextActive ? (
        <button
          onClick={onNext}
          className="h-[60px] px-[40px] rounded-[30px] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out border-none relative font-['Inter:Bold',sans-serif] font-bold text-[20px] text-white shadow-[0px_4px_15px_rgba(192,128,40,0.35)] hover:brightness-110 outline-none"
          style={{
            backgroundImage: "linear-gradient(-12.5431deg, rgb(192, 128, 40) 20.897%, rgb(243, 229, 171) 110.29%)"
          }}
        >
          Tiếp theo
        </button>
      ) : (
        <div className="bg-[#1a1a1a]/10 border border-solid border-[#1a1a1a]/20 flex h-[60px] items-center px-[40px] rounded-[30px] shrink-0 cursor-not-allowed">
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[20px] text-[#1a1a1a]/40 whitespace-nowrap">Tiếp theo</p>
        </div>
      )}
    </div>
  );
}

const loadMockImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("[Mock] Failed to load image as base64:", e);
    return "";
  }
};

function Frame19() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const name = "Khách hàng";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mockParam = params.get("mock");
    if (mockParam) {
      const isFemale = mockParam === "female" || mockParam === "true";
      const mockImgUrl = isFemale
        ? "/msb_2026/sample/female bán bánh mỳ.jpg"
        : "/msb_2026/sample/male đầu bếp.jpg";

      localStorage.removeItem("diSanIsMockUser"); // Tắt mock cứng để chạy sinh ảnh AI thật

      loadMockImageAsBase64(mockImgUrl).then(base64 => {
        if (base64) {
          setPreview(base64);
          localStorage.setItem("diSanUserGender", isFemale ? "female" : "male");
          console.log("[Mock] Auto loaded mock user for step 2");
        }
      });
    }
  }, []);

  const isNextActive = preview !== null;

  const handleNext = () => {
    if (isNextActive && preview) {
      localStorage.setItem("diSanStep2Image", preview);
      localStorage.setItem("diSanStep2Name", name);
      navigate("/vinpalacestep3");
    }
  };

  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full max-w-[500px]">
      <Frame20 />
      <Frame25 />
      <Frame22 preview={preview} setPreview={setPreview} />
      <Frame23 isNextActive={isNextActive} onNext={handleNext} />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center justify-center pb-[60px] md:pb-[100px] pt-[120px] md:pt-[160px] relative shrink-0 w-full px-[16px] md:px-[80px]">
      <Frame19 />
    </div>
  );
}


function Frame13() {
  return (
    <div className="relative content-stretch flex flex-col items-center w-full flex-1 justify-between">
      <Frame12 />
      <Footer />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute inset-[0_0.17%_0.44%_0]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.8336 23.8935">
        <g clipPath="url(#clip0_1_3854)" id="Frame">
          <path d={svgPaths.p3c830c90} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p34a4ff00} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p57c100} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p38765a00} fill="url(#paint0_radial_1_3854)" id="Vector_4" />
          <path d={svgPaths.p36a92270} fill="url(#paint1_radial_1_3854)" id="Vector_5" />
          <path d={svgPaths.p3db39980} fill="url(#paint2_radial_1_3854)" id="Vector_6" />
          <path d={svgPaths.p21fc9300} fill="url(#paint3_radial_1_3854)" id="Vector_7" />
        </g>
        <defs>
          <radialGradient cx="0" cy="0" gradientTransform="translate(18.6097 6.77974) scale(10.5291 10.5291)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_3854" r="1">
            <stop stopColor="#50350d" />
            <stop offset="0.07" stopColor="#8b5a16" />
            <stop offset="0.26" stopColor="#c08028" />
            <stop offset="0.44" stopColor="#a66d20" />
            <stop offset="0.62" stopColor="#c08028" />
            <stop offset="0.8" stopColor="#c08028" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(28.3927 12.4819) scale(10.5641 10.5641)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_3854" r="1">
            <stop offset="0.3" stopColor="#50350d" />
            <stop offset="0.35" stopColor="#8b5a16" />
            <stop offset="0.48" stopColor="#c08028" />
            <stop offset="0.6" stopColor="#a66d20" />
            <stop offset="0.73" stopColor="#c08028" />
            <stop offset="0.85" stopColor="#c08028" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(20.8064 1.23798) scale(22.5374)" gradientUnits="userSpaceOnUse" id="paint2_radial_1_3854" r="1">
            <stop offset="0.35" stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(3.27253 20.3161) scale(7.90849 7.90848)" gradientUnits="userSpaceOnUse" id="paint3_radial_1_3854" r="1">
            <stop offset="0.3" stopColor="#c08028" />
            <stop offset="1" stopColor="#50350d" />
          </radialGradient>
          <clipPath id="clip0_1_3854">
            <rect fill="white" height="23.8935" width="99.8336" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[0.18%_0_0.04%_0]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.9165 23.948">
        <g id="Group">
          <path d={svgPaths.p1c567100} fill="url(#paint0_linear_1_3842)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_3842" x1="29.9165" x2="-9.54047e-05" y1="14.7965" y2="14.8051">
            <stop stopColor="#c08028" />
            <stop offset="0.191421" stopColor="#d4af37" />
            <stop offset="1" stopColor="#FFE082" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Component() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-[29.918px]" data-name="35 1">
      <Group25 />
    </div>
  );
}

function Frame10() {
  return (
    <Link to="/" className="content-stretch flex gap-[10px] items-center pl-[12px] relative shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out" style={{ textDecoration: 'none' }}>
      <div className="h-[24px] overflow-clip relative shrink-0 w-[100px]" data-name="Logo MSB">
        <Frame1 />
      </div>
      <Component />
    </Link>
  );
}

function GotoPage() {
  return (
    <div className="bg-white content-stretch flex items-center relative rounded-[24px] shrink-0" data-name="Goto Page">
      <div aria-hidden="true" className="absolute border border-[#dee5ef] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex gap-[8px] h-[32px] items-center justify-center min-w-[96px] px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="icon 2">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#c08028] text-[14px] text-center whitespace-nowrap">About Us</p>
        <div className="relative shrink-0 size-[20px]" data-name="down">
          <div className="absolute flex inset-[33.86%_20.83%_33.85%_20.83%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="flex-none h-[100cqw] rotate-90 w-[100cqh]">
              <div className="relative size-full" data-name="Union">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.45833 11.6667">
                  <path d={svgPaths.p3387d500} fill="var(--fill-0, #091E42)" id="Union" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[-33.33%_-83.33%_-133.33%_-83.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <g filter="url(#filter0_d_1_3847)" id="Icon">
            <rect fill="var(--fill-0, #c08028)" fillOpacity="0.5" height="24" rx="12" shapeRendering="crispEdges" width="24" x="20" y="8" />
            <path clipRule="evenodd" d={svgPaths.pdd2d7c0} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="64" id="filter0_d_1_3847" width="64" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="12" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.810134 0 0 0 0 0.429844 0 0 0 0 0.229691 0 0 0 0.5 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_3847" />
              <feBlend in="BackgroundImageFix" in2="effect1_dropShadow_1_3847" mode="normal" result="BackgroundImageFix" />
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

function Frame24() {
  return (
    <div className="content-stretch hidden md:flex items-center justify-start px-[16px] md:px-[120px] pt-[90px] md:pt-[148px] w-full z-20 pointer-events-auto">
      <ButtonTiepNoiDiSan />
    </div>
  );
}

export default function Component4DiSnStep() {
  return (
    <div className="bg-white relative w-full min-h-screen overflow-x-hidden flex flex-col" data-name="4. Vở diễn/Step 2">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Bg />
      </div>
      <div className="relative w-full z-10 flex-1 flex flex-col">
        <Frame13 />
      </div>
      <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div className="pointer-events-auto relative max-w-[1440px] mx-auto w-full">
          <Frame24 />
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999]">
        <Header />
      </div>
    </div>
  );
}