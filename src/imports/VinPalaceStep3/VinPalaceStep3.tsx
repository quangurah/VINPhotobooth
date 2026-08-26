import Footer from "../../app/components/layout/Footer";
import Header from "../../app/components/layout/HeaderDiSan";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { getCapturedLogs, clearCapturedLogs } from "../../app/utils/logger.ts";

import svgPaths from "./svg-m940td67oc";
import imgBg from "./bg_theater_ocean_city_clean.jpg";
import imgLogoMsbCvtWhite1 from "./c6ec0d24b8a4207a7e6fca70124b4af014d9f188.png";
import imgGetItOnGooglePlayBadgeWebColorVietnamese1 from "./3ac909401012fd5310e51918c106ba79f3444bb5.png";
import imgSocialIcon from "./e3306c8635541fed0f99b5892dbacb4ffb3c2d3d.png";
import imgImage5 from "./d6c3f320cb8d9fc41bb2a31b1a330fc20fcbfe3d.png";
import imgFrame31 from "./4e98e8ab2b018af76bbbdd2524c947e7e844ecd4.png";
import imgFlagsViet from "./98f98befd43bf9d5547ecb4ec1ade495c7e9bc11.png";
import imgButtonExit from "./Button_Exit.png";
import { imgGroup } from "./svg-0cvqk";
import imgTapChiDiSanTuongLai from "./tap-chi-di-san-tuong-lai.png";
import imgLogoTypoDnthc from "./logo_typo_dnthc_clean.png";

// Helper để parse JSON an toàn, tránh lỗi SyntaxError: Unexpected token '<' khi API trả về HTML 404/500
async function safeParseJson(res: Response): Promise<any> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    const htmlSnippet = text.substring(0, 200).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    throw new Error(`Phản hồi từ máy chủ không phải JSON (HTTP Status ${res.status}). Nội dung: ${htmlSnippet}...`);
  }
  try {
    return await res.json();
  } catch (e: any) {
    throw new Error(`Lỗi cú pháp JSON: ${e.message}`);
  }
}

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
          <path d={svgPaths.pb870c80} fill="var(--fill-0, white)" id="Vector" />
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
          <path d={svgPaths.p271cf00} fill="var(--fill-0, white)" id="Vector" />
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
    <div className="h-[48px] relative shrink-0 w-full max-w-[328px] aspect-[328/48] h-auto" data-name="T� �� �NG LAI">
      <Group12 />
      <Group13 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0" data-name="VỞ DIỄN HOÀNG GIA TƯƠNG LAI">
      <img
        alt="Vinpearl Theatre Logo Typo"
        className="w-full max-w-[660px] h-auto object-contain shrink-0 relative mx-auto my-[40px]"
        src="/logo_typo_dnthc_clean.png"
      />
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return null;
}

function Frame16({ statusText }: { statusText: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
      <OverlayBorderOverlayBlur />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[24px] text-center text-[#4c2d03] whitespace-normal md:whitespace-nowrap">{statusText}</p>
    </div>
  );
}

function Frame18({ subStatusText, errorMsg, onBack }: { subStatusText: string, errorMsg: string | null, onBack: () => void }) {
  // Point to correct brand safety styling
  const isContentViolation = errorMsg ? (
    errorMsg.includes("từ ngữ không phù hợp") ||
    errorMsg.includes("Không thể sinh prompt") ||
    errorMsg.includes("không hợp lệ") ||
    errorMsg.includes("chứa quá 2 người")
  ) : false;

  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0">
      {errorMsg ? (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-[20px] pointer-events-auto">
          <div className="bg-white rounded-[24px] shadow-[0px_24px_48px_rgba(0,0,0,0.2)] max-w-[420px] w-full p-[32px] flex flex-col items-center gap-[20px] text-center border-t-8 border-[#c08028] transform transition-transform duration-300 scale-100 animate-scale-in">
            {/* Warning Icon SVG */}
            <div className="size-[64px] rounded-full bg-[rgba(192,128,40,0.1)] flex items-center justify-center text-[#c08028]">
              <svg className="size-[36px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="flex flex-col gap-[8px]">
              <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-[#091e42] m-0">Nội dung không phù hợp</h3>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[15px] text-[#5e6c84] leading-[22px] m-0">
                {isContentViolation
                  ? "Lời nhắn mô tả hoặc hình ảnh chân dung tải lên của bạn không phù hợp với quy chuẩn hình ảnh thương hiệu (Brand Safety). Vui lòng quay lại kiểm tra."
                  : errorMsg}
              </p>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-[#c08028] hover:bg-[#a86e20] text-white font-['Inter:Bold',sans-serif] font-bold text-[16px] rounded-[30px] py-[14px] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none border-none shadow-[0px_8px_16px_rgba(192,128,40,0.3)]"
            >
              Quay lại chỉnh sửa
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center relative shrink-0 size-[64.037px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none">
            <div className="relative size-[64.037px] animate-spin" data-name="Loading 4">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <g id="BG" />
              </svg>
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.0374 64.0374">
                <g id="Ellipse 12">
                  <mask fill="white" id="path-1-inside-1_1_3078">
                    <path d={svgPaths.p13a66a00} />
                  </mask>
                  <g clipPath="url(#paint0_angular_1_3078_clip_path)" mask="url(#path-1-inside-1_1_3078)" data-figma-skip-parse="true">
                    <g transform="matrix(0 -0.0320187 0.0320187 0 32.0187 32.0187)">
                      <foreignObject height="2583.33" width="2583.33" x="-1291.67" y="-1291.67">
                        <div style={{ background: "conic-gradient(from 90deg,rgba(192, 128, 40, 0) 0deg,rgba(192, 128, 40, 1) 360deg)", height: "100%", width: "100%", opacity: "1" }} xmlns="http://www.w3.org/1999/xhtml" />
                      </foreignObject>
                    </g>
                  </g>
                  <path d={svgPaths.p22f1ee00} mask="url(#path-1-inside-1_1_3078)" data-figma-gradient-fill="{'type':'GRADIENT_ANGULAR','stops':[{'color':{'r':192.0,'g':128.0,'b':40.0,'a':0.0},'position':0.0},{'color':{'r':192.0,'g':128.0,'b':40.0,'a':1.0},'position':1.0}],'stopsVar':[],'transform':{'m00':-7.5016937648754445e-14,'m01':64.037384033203125,'m02':7.5016937648754445e-14,'m10':-64.037384033203125,'m11':-8.2126512079665204e-14,'m12':64.037384033203125},'opacity':1.0,'blendMode':'NORMAL','visible':true}" />
                </g>
                <defs>
                  <clipPath id="paint0_angular_1_3078_clip_path">
                    <path d={svgPaths.p22f1ee00} mask="url(#path-1-inside-1_1_3078)" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FrameProps {
  statusText: string;
  subStatusText: string;
  errorMsg: string | null;
  onBack: () => void;
}

function Frame13({ statusText, subStatusText, errorMsg, onBack }: FrameProps) {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0">
      <Frame14 />
      <Frame16 statusText={statusText} />
      <Frame18 subStatusText={subStatusText} errorMsg={errorMsg} onBack={onBack} />
    </div>
  );
}

function Frame11({ statusText, subStatusText, errorMsg, onBack }: FrameProps) {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center justify-center min-h-[760px] pb-[60px] md:pb-[100px] pt-[75px] md:pt-[160px] relative shrink-0 w-full px-[16px] md:px-[80px]">
      <Frame13 statusText={statusText} subStatusText={subStatusText} errorMsg={errorMsg} onBack={onBack} />
    </div>
  );
}

function Frame12({ statusText, subStatusText, errorMsg, onBack }: FrameProps) {
  return (
    <div className="relative content-stretch flex flex-col items-center w-full flex-1 justify-between">
      <Frame11 statusText={statusText} subStatusText={subStatusText} errorMsg={errorMsg} onBack={onBack} />
      <Footer />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute inset-[0_0.17%_0.44%_0]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.8336 23.8935">
        <g clipPath="url(#clip0_1_2925)" id="Frame">
          <path d={svgPaths.p3c830c90} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p34a4ff00} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p57c100} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p38765a00} fill="url(#paint0_radial_1_2925)" id="Vector_4" />
          <path d={svgPaths.p36a92270} fill="url(#paint1_radial_1_2925)" id="Vector_5" />
          <path d={svgPaths.p3db39980} fill="url(#paint2_radial_1_2925)" id="Vector_6" />
          <path d={svgPaths.p21fc9300} fill="url(#paint3_radial_1_2925)" id="Vector_7" />
        </g>
        <defs>
          <radialGradient cx="0" cy="0" gradientTransform="translate(18.6097 6.77974) scale(10.5291 10.5291)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2925" r="1">
            <stop stopColor="#50350d" />
            <stop offset="0.07" stopColor="#8b5a16" />
            <stop offset="0.26" stopColor="#c08028" />
            <stop offset="0.44" stopColor="#a66d20" />
            <stop offset="0.62" stopColor="#c08028" />
            <stop offset="0.8" stopColor="#c08028" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(28.3927 12.4819) scale(10.5641 10.5641)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2925" r="1">
            <stop offset="0.3" stopColor="#50350d" />
            <stop offset="0.35" stopColor="#8b5a16" />
            <stop offset="0.48" stopColor="#c08028" />
            <stop offset="0.6" stopColor="#a66d20" />
            <stop offset="0.73" stopColor="#c08028" />
            <stop offset="0.85" stopColor="#c08028" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(20.8064 1.23798) scale(22.5374)" gradientUnits="userSpaceOnUse" id="paint2_radial_1_2925" r="1">
            <stop offset="0.35" stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(3.27253 20.3161) scale(7.90849 7.90848)" gradientUnits="userSpaceOnUse" id="paint3_radial_1_2925" r="1">
            <stop offset="0.3" stopColor="#c08028" />
            <stop offset="1" stopColor="#50350d" />
          </radialGradient>
          <clipPath id="clip0_1_2925">
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
          <path d={svgPaths.p1c567100} fill="url(#paint0_linear_1_3051)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_3051" x1="29.9165" x2="-9.54047e-05" y1="14.7965" y2="14.8051">
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

function ButtonTiepNoiDiSan() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/vinpalacestep1')}
      className="h-[60px] px-[36px] rounded-[30px] border border-solid border-[#c08028] bg-transparent text-[#c08028] hover:bg-[#c08028]/10 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out font-['Inter:Medium',sans-serif] font-medium text-[20px] outline-none z-20 pointer-events-auto"
    >
      Thoát
    </button>
  );
}

function Frame15() {
  return (
    <div className="content-stretch hidden md:flex items-center justify-start px-[16px] md:px-[120px] pt-[90px] md:pt-[148px] w-full z-20 pointer-events-auto">
      <ButtonTiepNoiDiSan />
    </div>
  );
}

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocal ? "http://127.0.0.1:6000/vinpalace-df621/asia-southeast1/api" : "https://api-phn3coaacq-as.a.run.app";



const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src && src.startsWith("http")) {
      img.crossOrigin = "anonymous";
      const separator = src.includes("?") ? "&" : "?";
      img.src = `${src}${separator}t=${Date.now()}`;
    } else {
      img.src = src;
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  drawStroke: boolean = false
) {
  // Tách câu slogan thành các phần bằng dấu '/'
  const linesToProcess = text.includes("/")
    ? text.split("/").map(p => p.trim())
    : [text];

  let currentY = y;

  for (let i = 0; i < linesToProcess.length; i++) {
    const part = linesToProcess[i];
    if (!part) continue;

    // Thực hiện wrap từ cho từng phần nếu nó vượt quá maxWidth
    const words = part.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        if (drawStroke) {
          ctx.strokeText(line.trim(), x, currentY);
        }
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    // Vẽ dòng còn lại của phần hiện tại
    if (line.trim()) {
      if (drawStroke) {
        ctx.strokeText(line.trim(), x, currentY);
      }
      ctx.fillText(line.trim(), x, currentY);
      currentY += lineHeight;
    }
  }
}

const cropAndResizeImage = (img: HTMLImageElement): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 928;
  canvas.height = 1152;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const targetRatio = 928 / 1152;
  const sourceRatio = img.width / img.height;

  if (sourceRatio >= targetRatio) {
    const cropWidth = img.height * targetRatio;
    const cropX = (img.width - cropWidth) / 2; // Căn giữa khi crop chiều rộng
    ctx.drawImage(img, cropX, 0, cropWidth, img.height, 0, 0, 928, 1152);
  } else {
    const cropHeight = img.width / targetRatio;
    const cropY = Math.max(0, (img.height - cropHeight) / 2);
    ctx.drawImage(img, 0, cropY, img.width, cropHeight, 0, 0, 928, 1152);
  }

  return canvas.toDataURL("image/jpeg", 0.9);
};

const compositeMagazineImage = async (
  cropImageBase64: string,
  removebgImageUrl: string,
  name: string,
  caption: string,
  description: string,
  isRemoveBgFallback: boolean = false,
  isMock: boolean = false
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const dpr = 2.0; // Hệ số scale 2.0 lần để đạt chất lượng 2K cực nét (1856 x 2304 px)
  canvas.width = Math.round(928 * dpr);
  canvas.height = Math.round(1152 * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const selectedConcept = Number(localStorage.getItem("selectedConcept") || "1");

  const safeLoadImage = async (url: string): Promise<HTMLImageElement | null> => {
    if (!url) return null;
    try {
      return await loadImage(url);
    } catch (e) {
      console.warn(`[Canvas] Tải ảnh lỗi: ${url}, dùng fallback.`);
      return null;
    }
  };

  let fontLoadPromise = Promise.resolve();
  try {
    fontLoadPromise = Promise.all([
      document.fonts.load("bold 90px 'SVN-Gotham Rounded'"),
      document.fonts.load("bold 55px 'SVN-Gotham Rounded'"),
      document.fonts.load("bold 64px 'SVN-Gotham Rounded'"),
      document.fonts.load("bold 22px 'SVN-Gotham Rounded'"),
      document.fonts.load("bold 13px 'SVN-Gotham Rounded'")
    ]);
  } catch (e) {
    console.warn("[Canvas] Lỗi load font SVN-Gotham Rounded:", e);
  }

  const [
    imgBg,
    headerGradImg,
    imgChar,
    footerGradImg
  ] = await Promise.all([
    loadImage(cropImageBase64),
    safeLoadImage("/msb_2026/material/layer/header_gradient.png?v=20260623"),
    safeLoadImage(removebgImageUrl),
    safeLoadImage("/msb_2026/material/layer/footer_gradient.png?v=20260623")
  ]);

  try {
    await fontLoadPromise;
  } catch (e) { }

  // Vẽ ảnh nền (đã được crop về đúng 928x1152)
  if (imgBg) {
    ctx.drawImage(imgBg, 0, 0, 928, 1152);
  }

  // Vẽ header gradient
  if (headerGradImg) {
    ctx.drawImage(headerGradImg, 0, 0, 928, 1152);
  } else {
    const scaleFactor = 928 / 1200;
    const grad = ctx.createLinearGradient(0, 0, 0, 350 * scaleFactor);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 928, 350 * scaleFactor);
  }

  // Chỉ vẽ đè nhân vật ở chế độ Mock
  const isMockActive = localStorage.getItem("diSanMockFile") !== null;
  const shouldOverlayChar = isMockActive;

  if (imgChar && shouldOverlayChar) {
    const charWidth = 928;
    const charHeight = 928;
    const charX = 0;
    const charY = 1152 - charHeight + 80;
    ctx.drawImage(imgChar, charX, charY, charWidth, charHeight);
  }

  // Vẽ footer gradient
  if (footerGradImg) {
    ctx.drawImage(footerGradImg, 0, 0, 928, 1152);
  } else {
    const scaleFactor = 928 / 1200;
    const grad = ctx.createLinearGradient(0, 1152 - 450 * scaleFactor, 0, 1152);
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.8)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 1152 - 450 * scaleFactor, 928, 450 * scaleFactor);
  }

  // Khung viền vàng đè lên trên cùng
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, 928 - 36, 1152 - 36);

  ctx.strokeStyle = "#F3E5AB";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 928 - 48, 1152 - 48);

  // Load logo typo tích hợp mới (bao gồm logo Vinpearl Theatre + chữ "Đất nước thiên cùng ca")
  const imgLogo = await loadImage(imgLogoTypoDnthc);
  // Vẽ logo typo mới căn giữa, rộng 210px (giảm 50% so với 420px ban đầu, tỉ lệ 2:1) ở phía trên canvas
  ctx.drawImage(imgLogo, (928 - 210) / 2, 20, 210, 105);

  return canvas.toDataURL("image/jpeg", 0.9);
};

export default function Component6DiSnStep() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("Chúng tôi đang giúp bạn hóa thân vào nhân vật...");
  const [subStatusText, setSubStatusText] = useState("Đang chuẩn bị sân khấu kịch nghệ hoàng gia...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const runPipeline = async () => {
      try {
        const description = localStorage.getItem("diSanStep1");
        let userPhotoBase64 = localStorage.getItem("diSanStep2Image");
        const name = localStorage.getItem("diSanStep2Name");
        const selectedConcept = localStorage.getItem("selectedConcept") || "1";
        const selectedOption = localStorage.getItem("selectedOption") || "1";

        if (!description || !userPhotoBase64 || !name) {
          setErrorMsg("Thiếu dữ liệu phiên làm việc. Vui lòng quay lại bước 1.");
          return;
        }

        const pipelineStart = Date.now();
        const sessionId = `session_vinplace_${Date.now()}`;
        localStorage.setItem("diSanSessionId", sessionId);
        const sessionDuration = ((Date.now() - pipelineStart) / 1000) || 0.05;
        console.log(`[Pipeline Time] 1. Khởi tạo session: ${sessionDuration.toFixed(2)}s`);

        // 1. Phân tích insight của user - Insight ảnh (để nhận diện giới tính/độ tuổi/số lượng người)
        setStatusText("Đang tìm kiếm góc mặt xuất thần của bạn");
        setSubStatusText("Định vị khuôn mặt và thần thái tự nhiên...");
        const detectStart = Date.now();
        const detectRes = await fetch(`${BASE_URL}/tclife/analyze-insight-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: userPhotoBase64, sessionId })
        });
        const detectData = await safeParseJson(detectRes);
        const detectDuration = (Date.now() - detectStart) / 1000;
        console.log(`[Pipeline Time] 2. Phân tích ảnh chân dung (B4.2): ${detectDuration.toFixed(2)}s`);

        if (detectData.logs) {
          console.log("[SERVER_LOGS][analyze-insight-image]:\n" + detectData.logs);
        }
        if (!detectRes.ok || !detectData.ok) {
          throw new Error(detectData.error || "Ảnh tải lên không hợp lệ hoặc chứa nhiều hơn 2 người.");
        }

        // Nếu phát hiện có nhiều người và backend đã crop lấy khuôn mặt to nhất
        if (detectData.croppedImageBase64) {
          console.log("[Crop] Detected multiple people. Automatically updated Step 2 image to cropped largest face.");
          localStorage.setItem("diSanStep2Image", detectData.croppedImageBase64);
          userPhotoBase64 = detectData.croppedImageBase64;
        }

        // Lưu gender và estimatedAge từ Gemini Vision vào localStorage
        const detectedGender = detectData.gender || "female";
        const detectedEstimatedAge = typeof detectData.estimatedAge === "number" ? detectData.estimatedAge : 25;
        const detectedPeopleCount = typeof detectData.count === "number" ? detectData.count : 1;

        localStorage.setItem("diSanUserGender", detectedGender);
        localStorage.setItem("diSanUserEstimatedAge", String(detectedEstimatedAge));
        localStorage.setItem("diSanPeopleCount", String(detectedPeopleCount));
        localStorage.setItem("diSanFaceDescription", detectData.faceDescription || "");
        localStorage.setItem("diSanSmileStyle", detectData.smileStyle || "gentle smile");

        // 2. Lấy prompt tĩnh từ backend dựa trên concept, option và gender
        setStatusText("Đang chuẩn bị trang phục & bối cảnh");
        setSubStatusText("Lựa chọn phục trang hoàng tộc phù hợp...");
        const promptsStart = Date.now();
        const promptsRes = await fetch(`${BASE_URL}/tclife/generate-prompts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            gender: detectedGender,
            selectedConcept,
            selectedOption,
            name
          })
        });
        const promptsData = await safeParseJson(promptsRes);
        const promptsDuration = (Date.now() - promptsStart) / 1000;
        console.log(`[Pipeline Time] 3. Sáng tạo prompt mô tả hình ảnh (B6): ${promptsDuration.toFixed(2)}s`);

        if (promptsData.logs) {
          console.log("[SERVER_LOGS][generate-prompts]:\n" + promptsData.logs);
        }
        if (!promptsRes.ok || !promptsData.ok) {
          throw new Error("Không thể tải thiết lập mẫu gợi ý.");
        }
        const finalPrompt = promptsData.prompts?.final || "";
        const caption = description || "VinPalace Theatre Photobooth";
        localStorage.setItem("diSanCaption", caption);

        let rawImageUrl = "";
        let cropImageBase64 = "";
        let removebgImageUrl = "";
        let removeBgFallback = false;

        // 3. Gọi sinh ảnh (Imagen) - Tự động ở chế độ mock/disk read cho demo nhanh chóng
        setStatusText("Đang phác họa dung mạo nhân vật");
        setSubStatusText("Imagen 3 đang khắc họa dung mạo nghệ thuật...");
        const imagenStart = Date.now();
        const imagenRes = await fetch(`${BASE_URL}/tclife/generate-magazine-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: finalPrompt,
            sessionId,
            description,
            gender: detectedGender,
            estimatedAge: detectedEstimatedAge,
            imageBase64: userPhotoBase64,
            faceDescription: detectData.faceDescription || "",
            smileStyle: detectData.smileStyle || "gentle smile",
            selectedConcept,
            selectedOption,
            isMock: false // Sinh ảnh thật bằng AI
          })
        });
        const imagenData = await safeParseJson(imagenRes);
        const imagenDuration = (Date.now() - imagenStart) / 1000;
        console.log(`[Pipeline Time] 4. Thực hiện vẽ ảnh qua AI (B7 - Imagen): ${imagenDuration.toFixed(2)}s`);

        if (imagenData.logs) {
          console.log("[SERVER_LOGS][generate-magazine-image]:\n" + imagenData.logs);
        }
        if (!imagenRes.ok || !imagenData.ok) {
          throw new Error("Lỗi khi tải ảnh nền. Vui lòng thử lại.");
        }
        rawImageUrl = imagenData.rawImageBase64 || imagenData.rawImageUrl;

        if (imagenData.mockFile) {
          localStorage.setItem("diSanMockFile", imagenData.mockFile);
        } else {
          localStorage.removeItem("diSanMockFile");
        }

        // 4. Crop ảnh và resize
        setStatusText("Đang căn chỉnh tỷ lệ vàng cho tác phẩm");
        setSubStatusText("Ghép nối chân dung của bạn vào khung hình tạp chí...");
        const cropStart = Date.now();
        const imgRawEl = await loadImage(rawImageUrl);
        cropImageBase64 = cropAndResizeImage(imgRawEl);
        const cropDuration = (Date.now() - cropStart) / 1000;
        console.log(`[Pipeline Time] 5. Tải ảnh AI, Crop & Resize (B8): ${cropDuration.toFixed(2)}s`);

        // 5. Tách nền ảnh chân dung (chỉ thực hiện ở chế độ Mock đọc đĩa để ghép mặt)
        const isMockActive = localStorage.getItem("diSanMockFile") !== null;
        if (isMockActive) {
          setStatusText("Đang hòa mình vào không gian kịch nghệ");
          setSubStatusText("Tách phông nền và xử lý ánh sáng studio...");
          try {
            const removeBgRes = await fetch(`${BASE_URL}/tclife/remove-bg`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageBase64: userPhotoBase64, sessionId })
            });
            const removeBgData = await safeParseJson(removeBgRes);
            if (removeBgRes.ok && removeBgData.ok) {
              removebgImageUrl = removeBgData.removebgImageBase64 || removeBgData.removebgImageUrl;
              removeBgFallback = removeBgData.fallbackTriggered || false;
            } else {
              removeBgFallback = true;
            }
          } catch (err) {
            console.warn("[RemoveBg] Tách nền thất bại, dùng fallback:", err);
            removeBgFallback = true;
          }
        } else {
          removeBgFallback = false;
        }

        // 6. Ghép layer canvas nghệ thuật từ dưới lên trên
        setStatusText("Đang hoàn thiện bức họa hoàng gia");
        setSubStatusText("Khắc họa viền vàng kim và tiêu đề lộng lẫy...");
        const finalImageBase64 = await compositeMagazineImage(
          cropImageBase64,
          removebgImageUrl,
          name,
          caption,
          description,
          removeBgFallback,
          true
        );

        // 7. Lưu session log
        setStatusText("Kiệt tác của bạn đã sẵn sàng");
        setSubStatusText("Đang đóng dấu hoàng gia lên tác phẩm...");
        const clientLogs = getCapturedLogs();
        const aiDuration = parseFloat(((Date.now() - pipelineStart) / 1000).toFixed(1));

        const saveRes = await fetch(`${BASE_URL}/tclife/save-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            name,
            description,
            rawImageUrl,
            cropImageUrl: cropImageBase64,
            removebgImageUrl,
            finalImageUrl: finalImageBase64,
            gender: detectedGender,
            styleId: "vinpalace_" + selectedConcept,
            logs: clientLogs,
            renderDuration: aiDuration
          })
        });

        let resultHttpUrl = "";
        try {
          const saveData = await safeParseJson(saveRes);
          if (saveData && saveData.finalImageUrl) {
            resultHttpUrl = saveData.finalImageUrl;
          }
        } catch (e) {
          console.warn("[Save Session] Không thể đọc finalImageUrl từ response:", e);
        }

        // Fallback tự construct nếu API bị lỗi
        if (!resultHttpUrl) {
          const conceptId = selectedConcept || "1";
          const storagePath = `sessions/msb_2026/${sessionId}/result-vinpalace_${conceptId}.jpeg`;
          const encodedStoragePath = encodeURIComponent(storagePath);
          resultHttpUrl = `https://firebasestorage.googleapis.com/v0/b/vinpalace-df621.firebasestorage.app/o/${encodedStoragePath}?alt=media`;
        }

        localStorage.setItem("diSanResultHttpUrl", resultHttpUrl);
        localStorage.setItem("diSanResultImage", finalImageBase64);
        clearCapturedLogs();

        setStatusText("Hóa thân hoàn tất!");
        setSubStatusText("Đang vén màn giới thiệu tác phẩm nghệ thuật...");
        setTimeout(() => {
          navigate("/vinpalacestep4");
        }, 1500);

      } catch (err: any) {
        console.error("[Pipeline Error]", err);
        setErrorMsg(err.message || "Đã xảy ra lỗi không xác định trong quá trình xử lý.");
      }
    };

    runPipeline();
  }, [navigate]);

  const handleBack = () => {
    navigate("/vinpalacestep2");
  };

  return (
    <div className="bg-white relative w-full min-h-screen overflow-x-hidden flex flex-col" data-name="6. Vở diễn/Step 3.1">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Bg />
      </div>
      <div className="relative w-full z-10 flex-1 flex flex-col">
        <Frame12
          statusText={statusText}
          subStatusText={subStatusText}
          errorMsg={errorMsg}
          onBack={handleBack}
        />
      </div>
      <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div className="pointer-events-auto relative max-w-[1440px] mx-auto w-full">
          <Frame15 />
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999]">
        <Header />
      </div>
    </div>
  );
}