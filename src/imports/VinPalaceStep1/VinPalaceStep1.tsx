import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import Header from "../../app/components/layout/HeaderDiSan";
import Footer from "../../app/components/layout/Footer";
import imgTapChiDiSanTuongLai from "./tap_chi_di_san_tuong_lai.png";
import svgPaths from "./svg-u1veon8gca";
import imgBg from "./bg_theater_ocean_city_clean.jpg";
import imgLogoMsbCvtWhite1 from "./c6ec0d24b8a4207a7e6fca70124b4af014d9f188.png";
import imgGetItOnGooglePlayBadgeWebColorVietnamese1 from "./3ac909401012fd5310e51918c106ba79f3444bb5.png";
import imgSocialIcon from "./e3306c8635541fed0f99b5892dbacb4ffb3c2d3d.png";
import imgImage5 from "./d6c3f320cb8d9fc41bb2a31b1a330fc20fcbfe3d.png";
import imgFrame31 from "./4e98e8ab2b018af76bbbdd2524c947e7e844ecd4.png";
import imgFlagsViet from "./98f98befd43bf9d5547ecb4ec1ade495c7e9bc11.png";
import imgButtonExit from "./Button_Exit.png";
import imgButtonTiepNoiDiSan1 from "./110ccd213c03f95479a0137a39acbe80ab0fa7da.png";
import { imgGroup } from "./svg-ngnsl";
import imgFrameCards from "./Frame 2117130469.png";
import imgButtonActive from "./ButtonActive.png";
import imgComponent3 from "./Component 3.png";
import imgComponent4 from "./Component 4.png";
import imgComponent5 from "./Component 5.png";
import imgComponent6 from "./Component 6.png";
import imgConcept01 from "./concept_01.png";
import imgConcept02 from "./concept_02.png";
import imgConcept03 from "./concept_03.png";
import imgConcept04 from "./concept_04.png";
import imgConcept05 from "./concept_05.png";
import imgConcept06 from "./concept_06.png";

const CONCEPT_IMAGES: Record<number, string> = {
  1: imgConcept01,
  2: imgConcept02,
  3: imgConcept03,
  4: imgConcept04,
  5: imgConcept05,
  6: imgConcept06
};


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

function Frame32() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] leading-[28px] min-w-px not-italic relative text-[24px] text-center text-shadow-[0px_0px_80px_rgba(0,0,0,0.4)] text-white tracking-[2.4px] uppercase">VinPalace Magazine</p>
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
    <div className="absolute inset-[1.92%_0.18%_2.63%_82.35%]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67.0785 57.2746">
        <g filter="url(#filter0_i_1_3051)" id="Group 4">
          <g id="Group 4_2">
            <path d={svgPaths.p2cb58600} fill="url(#paint0_linear_1_3051)" id="Vector" />
            <path d={svgPaths.p11817800} fill="url(#paint1_linear_1_3051)" id="Vector_2" />
          </g>
          <path d={svgPaths.p447e100} fill="var(--fill-0, #c08028)" id="Vector_3" />
          <path d={svgPaths.p26b45e00} fill="var(--fill-0, #FFE082)" id="Vector_4" />
          <path d={svgPaths.p2601b600} fill="url(#paint2_linear_1_3051)" id="Vector_5" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="59.2746" id="filter0_i_1_3051" width="67.0785" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.826883 0 0 0 0 0.446514 0 0 0 0.8 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_3051" />
          </filter>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_3051" x1="13.0412" x2="15.2118" y1="6.31261" y2="57.1969">
            <stop stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_3051" x1="32.0241" x2="34.1946" y1="6.31261" y2="57.1969">
            <stop stopColor="#c08028" />
            <stop offset="1" stopColor="#FFE082" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_3051" x1="59.1728" x2="62.7504" y1="17.3051" y2="56.8046">
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
    <div className="h-[60px] overflow-clip relative shrink-0 w-[384px]" data-name="Layer_1">
      <Group12 />
      <Group13 />
    </div>
  );
}

function TpChiDiSnTngLai() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="VỞ DIỄN HOÀNG GIA TƯƠNG LAI">
      <Frame32 />
      <Layer1 />
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return null;
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full">
      <OverlayBorderOverlayBlur />
      <p className="[word-break:break-word] font-['Inter_18pt:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-center text-white whitespace-normal tracking-[0px]">
        Vai diễn là điều bạn tự hào
        <br className="block md:hidden" />
        {` nhất ở hiện tại`}
      </p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full max-w-[646px] px-[16px]">
      <Frame25 />
    </div>
  );
}

function Goals() {
  return (
    <div className="relative shrink-0 size-[60px] md:size-[80px]" data-name="goals 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
        <g clipPath="url(#clip0_1_3021)" id="goals 1">
          <path d={svgPaths.p23d6e880} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3021">
            <rect fill="white" height="80" width="80" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <div className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-normal not-italic relative shrink-0 text-white w-full md:w-[180px] flex flex-col gap-[2px] md:gap-[4px] text-center items-center">
        <p className="leading-[18px] md:leading-[24px] mb-0 text-[17px] sm:text-[19px] md:text-[20px]">DỰ ÁN TÂM HUYẾT</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14px] md:leading-[20px] text-[14px] sm:text-[15px] md:text-[15px]">Ví dụ: cuốn sách viết dở</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full md:w-[196px]">
      <Frame15 />
    </div>
  );
}

function Component({ onClick }: { onClick: () => void }) {
  return (
    <img 
      src={imgComponent3} 
      alt="A passionate project"
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-auto shrink-0 w-[220px] md:w-[240px] object-contain" 
      data-name="Component 3"
    />
  );
}

function Diamond() {
  return (
    <div className="relative shrink-0 size-[60px] md:size-[80px]" data-name="diamond (1) 2">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
        <g clipPath="url(#clip0_1_3059)" id="diamond (1) 2">
          <path d={svgPaths.p11ab2900} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3059">
            <rect fill="white" height="80" width="80" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-w-px relative">
      <div className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-normal not-italic relative shrink-0 text-white w-full md:w-[190px] whitespace-pre-wrap flex flex-col gap-[2px] md:gap-[4px] text-center items-center">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] md:leading-[22px] mb-[4px] text-[16px] sm:text-[18px] md:text-[18px]">TÀI SẢN QUÝ GIÁ</p>
        <p className="leading-[14px] md:leading-[20px] mb-[2px] text-[14px] sm:text-[14px] md:text-[14px]">{`Ví dụ: căn hộ 2 phòng ngủ tự trang trí, `}</p>
        <p className="leading-[14px] md:leading-[20px] text-[14px] sm:text-[14px] md:text-[14px]">chiếc xe mơ ước...</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
      <Frame18 />
    </div>
  );
}

function Component1({ onClick }: { onClick: () => void }) {
  return (
    <img 
      src={imgComponent4} 
      alt="A cherished asset"
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-auto shrink-0 w-[220px] md:w-[240px] object-contain" 
      data-name="Component 4"
    />
  );
}

function Swatchbook() {
  return (
    <div className="relative shrink-0 size-[60px] md:size-[80px]" data-name="swatchbook 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
        <g clipPath="url(#clip0_1_2953)" id="swatchbook 1">
          <path d={svgPaths.p3669d40} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_2953">
            <rect fill="white" height="80" width="80" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <div className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-normal not-italic relative shrink-0 text-white w-full md:w-[204px] whitespace-pre-wrap flex flex-col gap-[2px] md:gap-[4px] text-center items-center">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] md:leading-[24px] mb-0 text-[17px] sm:text-[19px] md:text-[20px]">BẢN SẮC CÁ NHÂN</p>
        <p className="leading-[14px] md:leading-[20px] mb-0 text-[14px] sm:text-[15px] md:text-[15px]">{`Ví dụ: mái tóc đen dày bóng mượt, `}</p>
        <p className="leading-[14px] md:leading-[20px] text-[14px] sm:text-[15px] md:text-[15px]">đôi mắt đen tròn...</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full md:w-[196px]">
      <Frame20 />
    </div>
  );
}

function Component2({ onClick }: { onClick: () => void }) {
  return (
    <img 
      src={imgComponent5} 
      alt="Personal identity"
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-auto shrink-0 w-[220px] md:w-[240px] object-contain" 
      data-name="Component 5"
    />
  );
}

function HeartPartnerHandshake() {
  return (
    <div className="relative shrink-0 size-[60px] md:size-[80px]" data-name="heart-partner-handshake 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
        <g id="heart-partner-handshake 1">
          <path d={svgPaths.p119e0f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <div className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal h-auto leading-normal not-italic relative shrink-0 text-white w-full md:w-[189px] whitespace-pre-wrap flex flex-col gap-[2px] md:gap-[4px] text-center items-center">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] md:leading-[24px] mb-0 text-[17px] sm:text-[19px] md:text-[20px]">{`MỐI QUAN HỆ `}</p>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] md:leading-[24px] mb-0 text-[17px] sm:text-[19px] md:text-[20px]">ĐÁNG NHỚ</p>
        <p className="leading-[14px] md:leading-[20px] mb-0 text-[14px] sm:text-[15px] md:text-[15px]">Ví dụ: tình bạn 10 năm,</p>
        <p className="leading-[14px] md:leading-[20px] text-[14px] sm:text-[15px] md:text-[15px]">cuộc hôn nhân 20 năm</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
      <Frame23 />
    </div>
  );
}

// @ts-ignore
function Component3({ onClick }: { onClick: () => void }) {
  return (
    <img 
      src={imgComponent6} 
      alt="A memorable relationship"
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-auto shrink-0 w-[220px] md:w-[240px] object-contain" 
      data-name="Component 6"
    />
  );
}

function MessageHeart() {
  return (
    <div className="relative shrink-0 size-[60px] md:size-[80px]" data-name="message-heart 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
        <g id="message-heart 1">
          <path d={svgPaths.p2adff700} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <div className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-normal not-italic relative shrink-0 text-white w-full flex flex-col gap-[2px] md:gap-[4px] text-center items-center">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] md:leading-[22px] mb-0 text-[16px] sm:text-[17px] md:text-[18px]">BÀI HỌC CUỘC SỐNG /</p>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] md:leading-[22px] mb-0 text-[16px] sm:text-[17px] md:text-[18px]">KINH NGHIỆM</p>
        <p className="leading-[14px] md:leading-[20px] mb-0 text-[13px] sm:text-[14px] md:text-[15px]">Ví dụ: lời khuyên từ cha,</p>
        <p className="leading-[14px] md:leading-[20px] text-[13px] sm:text-[14px] md:text-[15px]">bí quyết truyền nghề từ tiền bối...</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full md:w-[198px]">
      <Frame27 />
    </div>
  );
}

function Component4({ onClick }: { onClick: () => void }) {
  return (
    <img 
      src={imgComponent7} 
      alt="Life lesson & experience"
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-auto shrink-0 w-[220px] md:w-[240px] object-contain" 
      data-name="Component 7"
    />
  );
}

function Frame21({ setText }: { setText: (t: string) => void }) {
  // Gán câu text mô tả mẫu trực tiếp khi click vào thẻ chủ đề
  const handleSelect = (topic: string) => {
    const defaultTexts: Record<string, string> = {
      "A PASSIONATE PROJECT": "Vai diễn của tôi là người truyền lửa, xây dựng những dự án tâm huyết cho cộng đồng.",
      "A CHERISHED ASSET": "Chương kịch ấm áp nhất của tôi là gìn giữ ngọn lửa yêu thương trong tổ ấm nhỏ tự tay vun vén.",
      "PERSONAL IDENTITY": "Phân cảnh rực rỡ nhất của tôi là tinh thần lạc quan, luôn tự tin tỏa sáng trước mọi giông bão.",
      "A MEMORABLE RELATIONSHIP": "Vở diễn hạnh phúc nhất của tôi là gia đình nhỏ ngập tràn tiếng cười và sự sẻ chia ấm áp.",
      "A LIFE LESSON & EXPERIENCE": "Chương diễn đắt giá của tôi là những bài học sâu sắc đúc kết từ thử thách và lòng kiên trì."
    };
    const selectedText = defaultTexts[topic] || "";
    setText(selectedText);

    // Cuộn mượt xuống khu vực textarea nhập liệu
    setTimeout(() => {
      const inputEl = document.querySelector('[data-name="INPUT_Mô tả vai diễn"]');
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const isAutoScrolling = useRef(false);
  const activeIndexRef = useRef(0);
  const cardWidth = 228; // w-[220px] + gap-[8px]

  // Tự động lướt slide Carousel trên mobile
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (scrollRef.current) {
        const next = (activeIndexRef.current + 1) % 5;
        activeIndexRef.current = next;
        isAutoScrolling.current = true;
        scrollRef.current.scrollTo({
          left: next * cardWidth,
          behavior: "smooth"
        });
        setTimeout(() => {
          isAutoScrolling.current = false;
        }, 500);
      }
    }, 3000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    if (isAutoScrolling.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const index = Math.round(scrollLeft / cardWidth);
    activeIndexRef.current = index;
    startTimer();
  };

  return (
    <div className="w-full pointer-events-auto flex flex-col items-center">
      {/* Bản Desktop: Hiển thị ảnh tĩnh gợi ý bài viết thay vì các thẻ card tương tác */}
      <div className="hidden md:flex justify-center w-full max-w-full mx-auto px-[16px]">
        <img 
          src={imgFrameCards} 
          alt="Writing suggestions" 
          className="w-full h-auto object-contain pointer-events-none rounded-[20px]" 
        />
      </div>

      {/* Bản Mobile: Hiển thị 5 card cuộn ngang (Carousel) */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="block md:hidden w-[calc(100%+32px)] -mx-[16px] overflow-x-auto scrollbar-none pb-[16px] snap-x snap-mandatory"
      >
        <div className="flex flex-row gap-0 justify-start px-[16px] w-max min-w-max">
          <div className="snap-center shrink-0">
            <Component onClick={() => handleSelect("A PASSIONATE PROJECT")} />
          </div>
          <div className="snap-center shrink-0">
            <Component1 onClick={() => handleSelect("A CHERISHED ASSET")} />
          </div>
          <div className="snap-center shrink-0">
            <Component2 onClick={() => handleSelect("PERSONAL IDENTITY")} />
          </div>
          <div className="snap-center shrink-0">
            <Component3 onClick={() => handleSelect("A MEMORABLE RELATIONSHIP")} />
          </div>
          <div className="snap-center shrink-0">
            <Component4 onClick={() => handleSelect("A LIFE LESSON & EXPERIENCE")} />
          </div>
        </div>
      </div>
    </div>
  );
}


function Frame33() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full max-w-[646px] px-[16px] mt-[-20px] gap-[4px] md:gap-[8px]">
      <div className="[word-break:break-word] font-['Inter_18pt:Bold',sans-serif] font-bold leading-[28px] tracking-[0px] not-italic relative shrink-0 text-[20px] text-center text-white w-full">
        <p className="mb-0 block md:hidden">
          Vậy vai diễn hiện tại của bạn là gì?
        </p>
        <p className="mb-0 hidden md:block tracking-[0px]">
          Vậy vai diễn hiện tại của bạn là gì?
        </p>
      </div>
      <p className="[word-break:break-word] font-['Inter_18pt:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[16px] text-center text-[rgba(255,255,255,0.8)] w-full mb-0">
        Mẹo: Phân cảnh diễn xuất sắc nhất sẽ dệt nên tương lai hoàng kim của bạn.
      </p>
    </div>
  );
}

function Frame11({ text, setText }: { text: string, setText: (t: string) => void }) {
  return (
    <div className="bg-white flex-[1_0_0] h-full min-w-px relative rounded-[12px] p-[14px] md:p-[16px] flex flex-col">
      <div className="relative w-full h-full">
        {text === "" && (
          <div className="absolute inset-0 pointer-events-none select-none text-[#a3a3a3] text-[15px] font-['Inter:Regular',sans-serif] leading-[20px] flex flex-col gap-0 z-0">
            <p className="m-0 flex items-start gap-[4px]"><span className="text-[#c08028] font-bold">*</span>Chương kịch của tôi là gìn giữ công thức ẩm thực hoàng gia được mọi người yêu thích</p>
            <p className="m-0 pl-[12px]">Vai diễn của tôi là người sáng lập không gian nghệ thuật cổ điển</p>
            <p className="m-0 pl-[12px]">Vở diễn của tôi là tiếp nối tri thức kịch nghệ từ cha mẹ</p>
            <p className="m-0 pl-[12px]">Chương kịch của tôi là tiếp thu bài học nghị lực đầu đời</p>
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full bg-transparent outline-none border-none resize-none text-[#091E42] text-[18px] font-['Inter:Regular',sans-serif] relative z-10"
          placeholder=""
        />
      </div>
    </div>
  );
}

function Frame28({ text, setText }: { text: string, setText: (t: string) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center justify-center min-h-px relative w-full">
      <Frame11 text={text} setText={setText} />
    </div>
  );
}

function InputMoTDiSn({ text, setText }: { text: string, setText: (t: string) => void }) {
  return (
    <div className="bg-[rgba(192,128,40,0.15)] h-[230px] relative rounded-[20px] shadow-[0px_12px_20px_0px_rgba(192,128,40,0.3)] shrink-0 w-full" data-name="INPUT_Mô tả vai diễn">
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[12px] relative size-full">
        <Frame28 text={text} setText={setText} />
      </div>
    </div>
  );
}

function Frame31({ text, setText }: { text: string, setText: (t: string) => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full max-w-[646px] px-[16px]">
      <InputMoTDiSn text={text} setText={setText} />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Inter:Medium_Italic',sans-serif] font-medium italic leading-[18px] relative shrink-0 text-[12px] text-white w-full">
        (*) Trường bắt buộc.
        <br />
        Bạn nên viết theo cấu trúc các ví dụ phía trên để có kết quả ảnh đẹp nhất.
      </p>
    </div>
  );
}
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocal ? "http://127.0.0.1:6000/vinpalace-df621/asia-southeast1/api" : "https://api-phn3coaacq-as.a.run.app";



function Frame29({ 
  text,
  selectedConcept,
  selectedOption
}: { 
  text: string;
  selectedConcept: number;
  selectedOption: number;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  
  const handleBack = () => {
    navigate('/vinpalacehome2');
  };

  const handleNext = () => {
    const conceptDefaultTexts: Record<number, string> = {
      1: "Hóa thân thành nhân vật Rồng Tiên uy nghi đứng giữa thác nước thiên giới và cánh hạc khổng lồ.",
      2: "Trở về thời khai nguyên gặt lúa vàng chín rộ trên cánh đồng thanh bình của Văn Lang.",
      3: "Hóa thân thành vị tướng dũng cảm đứng hiên ngang trước sóng lửa và khói trận Bạch Đằng.",
      4: "Hòa mình vào lễ hội trẩy hội non sông tưng bừng với đèn lồng rực rỡ tại Thăng Long cổ kính.",
      5: "Hóa thân thành chiến sĩ chào đón ngày đại thắng rực rỡ, ngập tràn niềm vui hòa bình.",
      6: "Vươn mình cùng Việt Nam hiện đại thịnh vượng giữa màn trình diễn ánh sáng drone tương lai."
    };
    const finalDesc = conceptDefaultTexts[selectedConcept] || "VinPalace Theatre Photobooth";
    localStorage.setItem('diSanStep1', finalDesc);
    localStorage.setItem('selectedConcept', String(selectedConcept));
    localStorage.setItem('selectedOption', String(selectedOption));
    navigate('/vinpalacestep2');
  };

  const isActive = true;

  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative z-10 shrink-0 mt-[24px]">
      <div className="flex gap-[12px] items-start justify-center">
        <div 
          onClick={handleBack}
          className="border border-solid border-[#4c2d03] bg-[#4c2d03] text-white hover:bg-[#6b450c] content-stretch flex h-[60px] isolate items-center justify-center px-[30px] py-[16px] relative rounded-[30px] shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
          data-name="Button"
        >
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[20px] whitespace-nowrap z-[1]">Quay lại</p>
        </div>

        {isActive ? (
          <button 
            onClick={handleNext}
            disabled={loading}
            className="h-[60px] px-[40px] rounded-[30px] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out border-none relative font-['Inter:Bold',sans-serif] font-bold text-[20px] text-white shadow-[0px_4px_15px_rgba(192,128,40,0.35)] hover:brightness-110 outline-none"
            style={{
              backgroundImage: "linear-gradient(-12.5431deg, rgb(192, 128, 40) 20.897%, rgb(243, 229, 171) 110.29%)"
            }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-[24px] w-[24px] border-2 border-white border-t-transparent"></div>
            ) : (
              "Tiếp theo"
            )}
          </button>
        ) : (
          <div className="bg-[#1a1a1a]/10 border border-solid border-[#1a1a1a]/20 flex h-[60px] items-center px-[40px] rounded-[30px] shrink-0 cursor-not-allowed">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[20px] text-[#1a1a1a]/40 whitespace-nowrap">Tiếp theo</p>
          </div>
        )}
      </div>

      {showViolationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-[20px] pointer-events-auto">
          <div className="bg-white rounded-[24px] shadow-[0px_24px_48px_rgba(0,0,0,0.2)] max-w-[420px] w-full p-[32px] flex flex-col items-center gap-[20px] text-center border-t-8 border-[#c08028] transform transition-transform duration-300 scale-100 animate-scale-in">
            <div className="size-[64px] rounded-full bg-[rgba(192,128,40,0.1)] flex items-center justify-center text-[#c08028]">
              <svg className="size-[36px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-[8px]">
              <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-[#091e42] m-0">Nội dung không phù hợp</h3>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[15px] text-[#5e6c84] leading-[22px] m-0">
                Mô tả vai diễn của bạn chứa từ ngữ không tuân thủ tiêu chuẩn an toàn thương hiệu. Vui lòng điều chỉnh lại nội dung.
              </p>
            </div>

            <button 
              onClick={() => setShowViolationModal(false)}
              className="w-full bg-[#c08028] hover:bg-[#a66d20] text-white font-['Inter:Bold',sans-serif] font-bold text-[16px] rounded-[30px] py-[14px] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none border-none shadow-[0px_8px_16px_rgba(192,128,40,0.3)]"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const CONCEPTS = [
  { id: 1, name: "HẬU DUỆ RỒNG TIÊN", desc: "Cánh chim hạc khổng lồ, thác nước thiên giới, mây ngũ sắc" },
  { id: 2, name: "CƯ DÂN LÚA NƯỚC KHAI NGUYÊN", desc: "Cánh đồng lúa chín vàng, núi non Văn Lang hùng vĩ, trống đồng xa xăm" },
  { id: 3, name: "HÀO KHÍ BẠCH ĐẰNG", desc: "Sông Bạch Đằng đỏ lửa, trận chiến cọc gỗ, kiếm giáo oai hùng" },
  { id: 4, name: "TRẨY HỘI NON SÔNG", desc: "Kinh thành Thăng Long cổ kính, hàng trăm đèn lồng, pháo hoa rực rỡ" },
  { id: 5, name: "NGÀY TOÀN THẮNG", desc: "Bình minh hòa bình, đoàn quân giải phóng, không khí hân hoan" },
  { id: 6, name: "VIỆT NAM THỊNH VƯỢNG", desc: "Thành phố ánh sáng hiện đại, trình diễn drone, pháo hoa tương lai" }
];

function Frame17({ 
  text, 
  setText,
  selectedConcept,
  setSelectedConcept,
  selectedOption,
  setSelectedOption
}: { 
  text: string;
  setText: (t: string) => void;
  selectedConcept: number;
  setSelectedConcept: (c: number) => void;
  selectedOption: number;
  setSelectedOption: (o: number) => void;
  }) {
  const handleSelectText = (conceptId: number) => {
    const conceptDefaultTexts: Record<number, string> = {
      1: "Hóa thân thành nhân vật Rồng Tiên uy nghi đứng giữa thác nước thiên giới và cánh hạc khổng lồ.",
      2: "Trở về thời khai nguyên gặt lúa vàng chín rộ trên cánh đồng thanh bình của Văn Lang.",
      3: "Hóa thân thành vị tướng dũng cảm đứng hiên ngang trước sóng lửa và khói trận Bạch Đằng.",
      4: "Hòa mình vào lễ hội trẩy hội non sông tưng bừng với đèn lồng rực rỡ tại Thăng Long cổ kính.",
      5: "Hóa thân thành chiến sĩ chào đón ngày đại thắng rực rỡ, ngập tràn niềm vui hòa bình.",
      6: "Vươn mình cùng Việt Nam hiện đại thịnh vượng giữa màn trình diễn ánh sáng drone tương lai."
    };
    setText(conceptDefaultTexts[conceptId] || "");
  };

  return (
    <div className="content-stretch flex flex-col gap-[30px] items-center relative shrink-0 w-full max-w-full overflow-hidden">
      <div className="text-center flex flex-col items-center">
        <div className="flex justify-center mb-[10px] mt-[10px]">
          <img src="/logo_typo_dnthc_clean.png" className="h-[330px] md:h-[420px] w-auto object-contain" alt="Vinpearl Theatre Logo Typo" />
        </div>
        <p className="text-[16px] md:text-[20px] font-bold text-[#4c2d03] uppercase tracking-[1.5px] mt-[5px] mb-[15px] font-sans">
          Vui lòng chọn Concept hóa thân bên dưới
        </p>
      </div>

      <div className="w-full max-w-[960px] pointer-events-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] px-[16px]">
          {CONCEPTS.map((concept) => {
            const isSelected = selectedConcept === concept.id;
            const bgImage = CONCEPT_IMAGES[concept.id];
            return (
              <div
                key={concept.id}
                onClick={() => {
                  setSelectedConcept(concept.id);
                  handleSelectText(concept.id);
                }}
                className={`cursor-pointer rounded-[20px] p-[20px] backdrop-blur-[12px] transition-all duration-300 transform hover:scale-[1.03] flex flex-col justify-between min-h-[140px] text-left border relative overflow-hidden group ${
                  isSelected
                    ? "border-[#c08028] shadow-[0px_0px_25px_rgba(192,128,40,0.45)]"
                    : "border-[rgba(255,255,255,0.12)]"
                }`}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, ${isSelected ? "0.4" : "0.6"}), rgba(0, 0, 0, ${isSelected ? "0.7" : "0.8"})), url(${bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-[8px] mb-[6px]">
                    <span className={`text-[11px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-[0.5px] ${
                      isSelected ? "bg-[#c08028] text-white" : "bg-[rgba(255,255,255,0.15)] text-white"
                    }`}>
                      Concept 0{concept.id}
                    </span>
                  </div>
                  <h4 className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-white leading-[22px] uppercase">
                    {concept.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Đã ẩn phần suy nghĩ/nguyện vọng tự chọn theo yêu cầu loại bỏ thay đổi text tự do */}
      <Frame29 text={text} selectedConcept={selectedConcept} selectedOption={selectedOption} />
    </div>
  );
}

function Frame12({ 
  text, 
  setText,
  selectedConcept,
  setSelectedConcept,
  selectedOption,
  setSelectedOption
}: { 
  text: string;
  setText: (t: string) => void;
  selectedConcept: number;
  setSelectedConcept: (c: number) => void;
  selectedOption: number;
  setSelectedOption: (o: number) => void;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[32px] md:gap-[40px] items-center justify-center pb-[120px] md:pb-[160px] pt-[120px] md:pt-[160px] px-[16px] md:px-0 relative z-10 shrink-0 w-full max-w-[1440px] mx-auto">
      <Frame17 
        text={text} 
        setText={setText} 
        selectedConcept={selectedConcept}
        setSelectedConcept={setSelectedConcept}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </div>
  );
}

function Frame13({ 
  text, 
  setText,
  selectedConcept,
  setSelectedConcept,
  selectedOption,
  setSelectedOption
}: { 
  text: string;
  setText: (t: string) => void;
  selectedConcept: number;
  setSelectedConcept: (c: number) => void;
  selectedOption: number;
  setSelectedOption: (o: number) => void;
}) {
  return (
    <div className="relative content-stretch flex flex-col items-center w-full flex-1 justify-between">
      <Frame12 
        text={text} 
        setText={setText} 
        selectedConcept={selectedConcept}
        setSelectedConcept={setSelectedConcept}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <Footer />
    </div>
  );
}



function ButtonTiepNoiDiSan() {
  const navigate = useNavigate();
  return (
    <img 
      src={imgButtonExit}
      alt="Exit"
      onClick={() => navigate('/vinpalacestep1')}
      className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out h-[60px] w-auto object-contain shrink-0" 
      data-name="Button_Tiep noi di san"
    />
  );
}

function Frame30() {
  return null;
}

export default function Component3DiSnStep() {
  const [text, setText] = useState(() => localStorage.getItem('diSanStep1') || "");
  const [selectedConcept, setSelectedConcept] = useState<number>(() => {
    return Number(localStorage.getItem('selectedConcept') || "1");
  });
  const [selectedOption, setSelectedOption] = useState<number>(() => {
    return Number(localStorage.getItem('selectedOption') || "1");
  });

  useEffect(() => {
    // Xóa cache ảnh cũ để đảm bảo khách hàng tiếp theo bắt đầu lượt mới hoàn toàn
    localStorage.removeItem("diSanStep2Image");
    localStorage.removeItem("diSanResultImage");
    localStorage.removeItem("diSanResultHttpUrl");
    localStorage.removeItem("diSanSessionId");
  }, []);

  return (
    <div className="bg-white relative w-full min-h-screen overflow-x-hidden flex flex-col" data-name="4. Step1/2">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Bg />
      </div>
      <div className="relative w-full z-10 flex-1 flex flex-col">
        <Frame13 
          text={text} 
          setText={setText} 
          selectedConcept={selectedConcept}
          setSelectedConcept={setSelectedConcept}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div className="pointer-events-auto relative max-w-[1440px] mx-auto w-full">
          <Frame30 />
        </div>
      </div>
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999]">
        <Header />
      </div>
    </div>
  );
}