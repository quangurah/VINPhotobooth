import { Link } from "react-router";
import { useState } from "react";
import imgButtonTheLe from "./button-the-le.png";
import imgLogoVinpearlTheatre from "./logo_vinpearl_theatre_white_clean.png";

// Định nghĩa SVG paths vẽ logo MSB, logo chữ M và các icon cho Header
const svgPaths = {
  p3c830c90: "M98.1365 11.5142L98.0034 11.381L98.1231 11.2346C98.9636 10.2441 99.3966 8.97142 99.3345 7.67388C99.1947 4.73212 96.5458 2.42264 93.2979 2.42264H86.3228C85.7708 2.42434 85.2415 2.64304 84.8493 3.03153C84.4571 3.42002 84.2333 3.94716 84.2263 4.49918V19.3744C84.2263 19.6497 84.2806 19.9223 84.3859 20.1767C84.4913 20.431 84.6457 20.6622 84.8404 20.8568C85.0351 21.0515 85.2662 21.2059 85.5205 21.3113C85.7749 21.4167 86.0475 21.4709 86.3228 21.4709H93.2779C94.9695 21.4793 96.6048 20.8631 97.8703 19.7404C98.4785 19.2184 98.9684 18.5725 99.3069 17.846C99.6455 17.1195 99.8251 16.329 99.8336 15.5275C99.8213 14.0178 99.211 12.5746 98.1365 11.5142V11.5142ZM88.3062 6.24294H93.5841C93.8202 6.21301 94.0601 6.23369 94.2876 6.30362C94.5152 6.37355 94.7252 6.49112 94.9038 6.64851C95.0824 6.80591 95.2255 6.99952 95.3235 7.21648C95.4215 7.43344 95.4722 7.66877 95.4722 7.90683C95.4722 8.14422 95.4215 8.38022 95.3235 8.59718C95.2255 8.81414 95.0824 9.00775 94.9038 9.16515C94.7252 9.32254 94.5152 9.44011 94.2876 9.51004C94.0601 9.57997 93.8202 9.60066 93.5841 9.57073H88.3062V6.24294ZM93.6306 17.6572H88.3062V13.4043H93.6306C93.9199 13.3881 94.2094 13.4311 94.4815 13.5307C94.7536 13.6302 95.0025 13.7843 95.213 13.9833C95.4235 14.1823 95.5911 14.4223 95.7057 14.6883C95.8203 14.9544 95.8794 15.2411 95.8794 15.5308C95.8794 15.8205 95.8203 16.1072 95.7057 16.3732C95.5911 16.6393 95.4235 16.8792 95.213 17.0783C95.0025 17.2773 94.7536 17.4313 94.4815 17.5309C94.2094 17.6304 93.9199 17.6734 93.6306 17.6572Z",
  p34a4ff00: "M75.6206 10.0233C74.0166 9.59066 72.0998 9.09149 72.0266 7.79365C71.9733 6.88184 72.6922 6.11645 73.8635 5.97003C76.2196 5.67053 78.3427 7.06154 79.4476 7.33442C79.6919 7.37989 79.9431 7.37398 80.185 7.31706C80.427 7.26015 80.6544 7.15349 80.8529 7.00385C81.0513 6.85422 81.2165 6.6649 81.3378 6.44795C81.4591 6.231 81.5339 5.99118 81.5574 5.74374C81.7371 4.31945 80.3261 3.54074 79.7937 3.21462C78.3048 2.37155 76.6117 1.95692 74.9018 2.01662C70.7088 2.01662 67.787 4.43925 67.787 7.9068C67.7479 8.73802 67.9168 9.56586 68.2782 10.3154C68.6396 11.065 69.1822 11.7126 69.8569 12.1996C72.5191 14.1963 77.7504 13.9767 77.757 16.0466C77.757 17.9101 74.3228 19.0615 70.5357 16.5524C70.2592 16.3336 69.9267 16.1971 69.5762 16.1585C69.2257 16.12 68.8714 16.181 68.5539 16.3345C68.2365 16.488 67.9687 16.7278 67.7812 17.0265C67.5938 17.3252 67.4943 17.6706 67.4941 18.0233C67.4926 18.3582 67.5824 18.6872 67.7537 18.975L67.6805 19.015H67.7537L67.8203 19.1214C68.2134 19.6625 68.7086 20.1215 69.2778 20.4725C70.9117 21.4622 72.8 21.9505 74.7088 21.8769C76.6275 21.9693 78.5202 21.4034 80.0732 20.2729C80.7237 19.7396 81.2423 19.0634 81.5886 18.2968C81.935 17.5303 82.0996 16.6942 82.0698 15.8536C82.0698 12.2263 78.975 10.9417 75.6206 10.0233Z",
  p57c100: "M63.2746 2.4293H61.9834C61.6188 2.42969 61.2618 2.53295 60.9533 2.72722C60.6449 2.92148 60.3975 3.19887 60.2396 3.52747L55.807 12.6589L51.3877 3.52747C51.2316 3.1989 50.9856 2.92132 50.6781 2.72694C50.3706 2.53256 50.0144 2.42936 49.6506 2.4293H48.3594C47.812 2.43616 47.2888 2.65624 46.901 3.04275C46.5133 3.42927 46.2915 3.95176 46.2829 4.49919V19.6073C46.2865 19.9725 46.3867 20.3303 46.5732 20.6443C46.7598 20.9582 47.0261 21.2173 47.3452 21.395C47.6642 21.5728 48.0246 21.663 48.3898 21.6564C48.7549 21.6499 49.1119 21.5468 49.4243 21.3578C49.7134 21.1972 49.9539 20.9616 50.1202 20.6758C50.2865 20.3899 50.3726 20.0645 50.3694 19.7338V10.7554L54.0366 17.8103C54.2022 18.1426 54.4572 18.4221 54.7729 18.6175C55.0885 18.8129 55.4524 18.9164 55.8237 18.9164C56.1949 18.9164 56.5588 18.8129 56.8745 18.6175C57.1901 18.4221 57.4451 18.1426 57.6107 17.8103L61.2779 10.7687V19.7338C61.2761 20.0642 61.3628 20.3891 61.529 20.6747C61.6952 20.9603 61.9348 21.1961 62.223 21.3578C62.5355 21.5468 62.8924 21.6499 63.2576 21.6564C63.6227 21.663 63.9831 21.5728 64.3021 21.395C64.6212 21.2173 64.8875 20.9582 65.0741 20.6443C65.2606 20.3303 65.3608 19.9725 65.3644 19.6073V4.49919C65.3574 3.94893 65.1344 3.42349 64.7434 3.03625C64.3524 2.649 63.8249 2.431 63.2746 2.4293Z",
  p38765a00: "M17.6905 22.0034L6.55577 8.73215C5.65137 7.64963 5.2135 6.25246 5.33828 4.84739C5.46306 3.44231 6.14031 2.14417 7.22133 1.23798C8.30386 0.333573 9.70103 -0.104302 11.1061 0.0204824C12.5112 0.145267 13.8093 0.822512 14.7155 1.90353L25.8569 15.1481C26.7613 16.2307 27.1992 17.6278 27.0744 19.0329C26.9496 20.438 26.2724 21.7361 25.1914 22.6423V22.6423C24.1118 23.5519 22.7153 23.9956 21.3087 23.8757C19.9021 23.7559 18.6007 23.0825 17.6905 22.0034V22.0034Z",
  p36a92270: "M29.7305 6.42928L26.9684 19.6473C26.8288 20.3339 26.555 20.9863 26.1627 21.5669C25.7704 22.1475 25.2674 22.645 24.6825 23.0309C24.0976 23.4167 23.4422 23.6833 22.754 23.8153C22.0659 23.9474 21.3584 23.9423 20.6722 23.8003V23.8003C19.9839 23.6587 19.3305 23.3821 18.7495 22.9867C18.1686 22.5913 17.6717 22.0847 17.2875 21.4964C16.9033 20.908 16.6393 20.2493 16.5109 19.5584C16.3825 18.8675 16.392 18.158 16.5391 17.4709L19.3012 4.25291C19.5908 2.8736 20.4155 1.66541 21.5945 0.893146C22.7735 0.120886 24.2105 -0.152431 25.5907 0.133104V0.133104C26.2762 0.274242 26.9271 0.54913 27.5062 0.942046C28.0854 1.33496 28.5814 1.8382 28.9658 2.42297C29.3503 3.00774 29.6158 3.66257 29.747 4.35001C29.8782 5.03745 29.8726 5.74401 29.7305 6.42928Z",
  p3db39980: "M31.5807 22.0034L20.446 8.73215C19.5416 7.64963 19.1037 6.25246 19.2285 4.84739C19.3532 3.44231 20.0305 2.14417 21.1115 1.23798C22.194 0.333573 23.5912 -0.104302 24.9963 0.0204824C26.4014 0.145267 27.6995 0.822512 28.6057 1.90353L39.7272 15.1481C40.6316 16.2307 41.0694 17.6278 40.9446 19.0329C40.8199 20.438 40.1426 21.7361 39.0616 22.6423V22.6423C37.9832 23.5457 36.5911 23.9856 35.1894 23.8658C33.7877 23.7461 32.4903 23.0765 31.5807 22.0034V22.0034Z",
  p21fc9300: "M10.6223 18.1497C10.7113 19.2363 10.4647 20.3239 9.91567 21.2658C9.36668 22.2076 8.54181 22.9583 7.5525 23.4163C6.5632 23.8743 5.45715 24.0176 4.38379 23.8268C3.31044 23.636 2.32152 23.1203 1.55064 22.3495C0.779772 21.5786 0.264107 20.5897 0.0733194 19.5163C-0.117468 18.443 0.0258159 17.3369 0.483819 16.3476C0.941822 15.3583 1.69247 14.5334 2.63433 13.9844C3.57619 13.4355 4.66386 13.1888 5.7504 13.2778C7.00808 13.3809 8.18828 13.9273 9.08058 14.8195C9.97287 15.7118 10.5192 16.892 10.6223 18.1497Z",
  p1c567100: "M29.8164 0C29.9492 0.00170019 29.92 0.081452 29.8955 1.64355C29.8941 1.73781 29.8562 1.71364 29.7578 1.71387C22.8189 1.73161 22.7974 1.69932 22.7334 1.77051C22.078 2.49963 19.9566 4.73809 19.9639 4.80566C19.9651 4.81161 22.9125 5.35454 24.8467 8.00488C29.5242 14.4146 23.3094 23.3853 15.1875 20.6377C15.0278 20.5837 14.8178 21.1807 13.6817 22.1045C8.4722 26.3401 0.0839927 22.8849 1.90331e-05 15.7373C-0.00150541 15.6072 0.0847413 15.6677 1.64357 15.6807C1.85155 15.6828 1.61936 16.2268 2.02248 17.5645C2.77163 20.0501 4.79144 21.3692 6.01076 21.8008C12.8248 24.2123 18.0039 15.9484 12.9737 10.9961C12.8286 10.8638 12.4613 10.4903 11.752 10.0615C11.6548 10.003 11.6223 10.074 11.2422 10.5C9.47927 12.4757 9.34036 12.6826 9.20705 12.6836C9.03144 12.6847 7.23309 12.6949 7.01174 12.6846C6.9463 12.6815 7.23018 12.3956 7.25978 12.3623C7.65797 11.9145 8.05593 11.4664 8.45412 11.0186C9.69203 9.63144 10.0007 9.33517 9.90627 9.31055C8.77371 9.01534 6.54721 9.16293 6.48732 9.11523C6.44222 9.07258 10.6672 4.57508 10.668 4.54297C10.6686 4.45807 3.25794 4.56093 3.19435 4.48828C3.17496 4.44772 3.18524 2.85621 3.1885 2.83008C3.21479 2.74875 12.6226 2.81189 14.4541 2.79297C14.4662 2.79285 14.6531 2.79068 14.5928 2.85547C14.2417 3.22951 11.152 6.52183 10.2403 7.56445C10.1869 7.62543 10.2627 7.62993 11.2022 7.89551C11.263 7.91189 11.5762 7.51148 13.6514 5.20117C15.7558 2.85827 15.737 2.7944 15.8906 2.79297C17.9983 2.77458 18.1952 2.72479 18.0781 2.85352C17.2848 3.72572 17.2937 3.72504 14.7363 6.59277C12.9578 8.58709 12.7631 8.63606 12.9502 8.76172C12.975 8.77839 16.1035 10.6151 16.6397 14.5205C16.9811 17.0084 16.1175 18.813 16.0313 19.041C15.9978 19.1295 16.3409 19.1974 16.3643 19.2031C22.6186 20.7536 26.9551 13.8576 23.4717 9.07617C20.7921 5.39828 16.384 6.52171 16.2197 6.30762C16.1893 6.25802 19.9323 2.27367 20.7432 1.36719C21.9425 0.0264839 21.9512 0.00463945 22.1065 0H29.8164ZM27.3828 13.6982C28.9576 13.684 29.0436 13.6647 29.0322 13.7949C28.7499 17.0229 27.3254 18.9289 26.4014 20.0156C25.1419 21.3936 23.3448 22.9272 20.1719 23.543C17.1807 24.1233 14.2475 23.0896 14.3457 22.9922C14.9928 22.3504 15.0043 22.3666 15.5801 21.6641C15.733 21.4775 18.805 23.0739 22.9561 20.666C26.1706 18.8012 26.9634 15.502 27.0947 14.9551C27.3129 14.0469 27.2131 13.6998 27.3828 13.6982Z",
  p3bbed280: "M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L4.66667 3.95956L8.47978 0.146447C8.67504 -0.0488155 8.99162 -0.0488155 9.18689 0.146447C9.38215 0.341709 9.38215 0.658291 9.18689 0.853553L5.02022 5.02022C4.82496 5.21548 4.50838 5.21548 4.31311 5.02022L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z",
  p3387d500: "M0.183058 0.183058C0.427136 -0.0610194 0.822864 -0.0610194 1.06694 0.183058L6.27528 5.39139C6.51935 5.63547 6.51935 6.0312 6.27528 6.27528L1.06694 11.4836C0.822864 11.7277 0.427136 11.7277 0.183058 11.4836C-0.0610194 11.2395 -0.0610194 10.8438 0.183058 10.5997L4.94945 5.83333L0.183058 1.06694C-0.0610194 0.822864 -0.0610194 0.427136 0.183058 0.183058Z",
  p368700f0: "M11.7169 6.37139C9.17199 7.16286 7.16287 9.18417 6.3714 11.7169C6.24963 12.0944 5.75037 12.0944 5.6286 11.7169C4.83713 9.17199 2.82801 7.16286 0.283105 6.37139C-0.0943685 6.24962 -0.0943685 5.75038 0.283105 5.62861C2.82801 4.83714 4.83713 2.82801 5.6286 0.283105C5.75037 -0.0943683 6.24963 -0.0943683 6.3714 0.283105C7.16287 2.82801 9.17199 4.83714 11.7169 5.62861C12.0944 5.75038 12.0944 6.24962 11.7169 6.37139Z"
};

// Component vẽ logo MSB
function Frame1() {
  return (
    <div className="absolute inset-0" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.8336 23.8935">
        <g clipPath="url(#clip0_2_4005_h)" id="Frame">
          <path d={svgPaths.p3c830c90} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p34a4ff00} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p57c100} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p38765a00} fill="url(#paint0_radial_2_4005_h)" id="Vector_4" />
          <path d={svgPaths.p36a92270} fill="url(#paint1_radial_2_4005_h)" id="Vector_5" />
          <path d={svgPaths.p3db39980} fill="url(#paint2_radial_2_4005_h)" id="Vector_6" />
          <path d={svgPaths.p21fc9300} fill="url(#paint3_radial_2_4005_h)" id="Vector_7" />
        </g>
        <defs>
          <radialGradient cx="0" cy="0" gradientTransform="translate(18.6097 6.77974) scale(10.5291 10.5291)" gradientUnits="userSpaceOnUse" id="paint0_radial_2_4005_h" r="1">
            <stop stopColor="#9D0B0F" />
            <stop offset="0.07" stopColor="#AA0E12" />
            <stop offset="0.26" stopColor="#C7141A" />
            <stop offset="0.44" stopColor="#DB1820" />
            <stop offset="0.62" stopColor="#E81B23" />
            <stop offset="0.8" stopColor="#EC1C24" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(28.3927 12.4819) scale(10.5641 10.5641)" gradientUnits="userSpaceOnUse" id="paint1_radial_2_4005_h" r="1">
            <stop offset="0.3" stopColor="#9D0B0F" />
            <stop offset="0.35" stopColor="#AA0E12" />
            <stop offset="0.48" stopColor="#C7141A" />
            <stop offset="0.6" stopColor="#DB1820" />
            <stop offset="0.73" stopColor="#E81B23" />
            <stop offset="0.85" stopColor="#EC1C24" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(20.8064 1.23798) scale(22.5374)" gradientUnits="userSpaceOnUse" id="paint2_radial_2_4005_h" r="1">
            <stop offset="0.35" stopColor="#EC1C24" />
            <stop offset="1" stopColor="#F26F21" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(3.27253 20.3161) scale(7.90849 7.90848)" gradientUnits="userSpaceOnUse" id="paint3_radial_2_4005_h" r="1">
            <stop offset="0.3" stopColor="#EC1C24" />
            <stop offset="1" stopColor="#9D0B0F" />
          </radialGradient>
          <clipPath id="clip0_2_4005_h">
            <rect fill="white" height="23.8935" width="99.8336" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Component vẽ logo chữ M
function Group46() {
  return (
    <div className="absolute inset-[0.18%_0_0.04%_0]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.9165 23.948">
        <g id="Group">
          <path d={svgPaths.p1c567100} fill="url(#paint0_linear_5_3782_h)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_3782_h" x1="29.9165" x2="-9.54047e-05" y1="14.7965" y2="14.8051">
            <stop stopColor="#ED1C24" />
            <stop offset="0.191421" stopColor="#EF4029" />
            <stop offset="1" stopColor="#FF671F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LogoM() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-[29.918px]" data-name="35 1">
      <Group46 />
    </div>
  );
}

function LogoMsbWrapper() {
  return (
    <Link to="/vinpalacestep1" className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out" style={{ textDecoration: 'none' }}>
      <img src={imgLogoVinpearlTheatre} alt="Vinpearl Theatre Logo" className="h-[75px] md:h-[95px] w-auto object-contain mt-[10px] md:mt-[20px]" />
    </Link>
  );
}

function GotoPage() {
  return null;
}

function QuickActionWeb() {
  return null;
}

function Nav() {
  return (
    <div className="content-stretch flex justify-center items-center relative w-full" data-name="Nav">
      <LogoMsbWrapper />
    </div>
  );
}

function Support() {
  return null;
}

function BurgerButton({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  // Cho phép hiện burger button trên mobile để xem Thể lệ chi tiết
  return (
    <button 
      onClick={() => setIsOpen(!isOpen)} 
      className="relative w-8 h-8 flex flex-col justify-center items-center md:hidden focus:outline-none z-50 ml-[8px]"
      aria-label="Toggle menu"
    >
      <div className="absolute w-[20px] h-[16px] flex flex-col justify-between">
        <span className={`h-[2px] w-full bg-white rounded-full transition-transform duration-300 ease-in-out origin-left ${isOpen ? 'rotate-[42deg] translate-y-[-1px] translate-x-[2px]' : ''}`} />
        <span className={`h-[2px] w-full bg-white rounded-full transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`h-[2px] w-full bg-white rounded-full transition-transform duration-300 ease-in-out origin-left ${isOpen ? '-rotate-[42deg] translate-y-[1px] translate-x-[2px]' : ''}`} />
      </div>
    </button>
  );
}

function HeaderTop({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  return (
    <div className="max-w-[1366px] mx-auto relative shrink-0 w-full" data-name="Header top">
      <div className="flex flex-row items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center max-w-[inherit] px-[16px] md:px-[24px] pt-[8px] pb-[12px] relative size-full w-full">
          <Nav />
          <div className="absolute right-[16px] md:right-[24px] flex items-center">
            <Support />
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return null;
}

function MenuCta() {
  const handleTheLeClick = () => {
    if (window.location.pathname === '/vinpalacestep1') {
      const element = document.getElementById('the-le-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/vinpalacestep1#the-le-section';
    }
  };

  return (
    <div className="max-w-[1366px] mx-auto relative shrink-0 w-full" data-name="Menu & CTA">
      <div className="flex flex-row items-center justify-end max-w-[inherit] size-full">
        <div className="content-stretch flex gap-[12px] sm:gap-[24px] items-center justify-end max-w-[inherit] px-[16px] md:px-[24px] py-[12px] relative size-full">
          <div 
            onClick={handleTheLeClick}
            className="content-stretch flex gap-[6px] sm:gap-[12px] items-center pl-[6px] pr-[12px] py-[6px] sm:pl-[8px] sm:pr-[20px] sm:py-[8px] relative rounded-[20px] sm:rounded-[26px] shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out" 
            data-name="Button_Tiep noi di san"
          >
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] sm:rounded-[26px] size-full" src={imgButtonTheLe} />
            <div className="overflow-clip relative shrink-0 size-[18px] sm:size-[24px]" data-name="Icon/info">
              <div className="absolute inset-[0_-0.05%_0_0]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0127 24">
                  <path d="M12.7111 0L12.9778 0.038176C18.8317 0.445387 23.5175 5.17922 23.9746 11.0329L24.0127 11.3001V12.7126L23.9746 12.9799C23.5556 18.8208 18.8571 23.5292 13.0286 23.9745L12.6222 24H11.4159L11.0095 23.9745C5.15556 23.5164 0.507937 18.8081 0.0380952 12.9671L0 12.6999V11.2874L0.0380952 11.0329C0.507937 5.17922 5.18095 0.509014 11.0349 0.038176L11.3016 0H12.7111ZM14.1841 7.69883C15.0476 7.08802 15.1492 5.91729 14.4254 5.17922C13.7016 4.44115 12.5079 4.42842 11.7587 5.14104C11.0095 5.85366 11.0603 6.92259 11.8095 7.57158C12.4698 8.14422 13.4603 8.22057 14.1968 7.69883H14.1841ZM13.0286 19.1516L14.5016 18.6045L14.7048 17.7646C14.146 17.9809 13.6381 18.0954 13.0921 18.0064C12.7238 17.9427 12.4952 17.6882 12.4825 17.2937C12.4698 16.8484 12.546 16.3902 12.6603 15.9449L13.5365 12.789C13.6635 12.3563 13.6762 11.8982 13.6762 11.4528C13.6762 10.6638 13.1556 10.0148 12.419 9.77306C11.073 9.32768 9.86667 9.87487 8.59683 10.3584L8.40635 11.211C9.28254 10.842 10.5143 10.7147 10.5778 11.6182C10.6159 12.0764 10.5397 12.5345 10.4127 12.9926L9.56191 16.0721C9.43492 16.5429 9.38413 17.0138 9.39683 17.4973C9.39683 18.2736 9.91746 18.9226 10.6667 19.1771C11.4159 19.4316 12.2667 19.4443 13.0413 19.1516H13.0286Z" fill="var(--fill-0, white)" />
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] sm:text-[14px] lg:text-[16px] text-center text-white whitespace-nowrap">Rules & Regulations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header1({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  return (
    <div className="w-full flex flex-col items-center shrink-0 z-[9999]" data-name="Header">
      <div className="bg-black w-full flex flex-col items-center shrink-0">
        <div className="h-[5px] w-full shrink-0" />
        <HeaderTop isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}

export default function HeaderDiSan() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleTheLeClick = () => {
    if (window.location.pathname === '/vinpalacestep1') {
      const element = document.getElementById('the-le-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/vinpalacestep1#the-le-section';
    }
  };

  return (
    <div className="content-stretch flex flex-col items-center pointer-events-auto w-full z-[9999]" data-name="Header">
      <Header1 isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
