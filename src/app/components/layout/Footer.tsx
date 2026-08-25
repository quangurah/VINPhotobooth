import { Link } from "react-router";
import imgLogoVinpearlTheatre from "./logo_vinpearl_theatre_color.png";

export default function Footer({ scaleUp = false }: { scaleUp?: boolean }) {
  return (
    <div className="bg-[#202020] text-gray-300 content-stretch flex flex-col items-center justify-end relative z-20 isolate rounded-tl-[12px] rounded-tr-[12px] w-full self-stretch mt-[24px]" data-name="Footer">

      {/* Upper part: Main Information */}
      <div className="relative shrink-0 w-full max-w-[1200px] mx-auto px-[16px] py-[20px]">
        <div className="flex flex-col items-center gap-y-[16px] text-center">

          {/* Logo and title */}
          <div className="flex flex-col gap-[8px] items-center">
            <Link to="/vinpalacestep1" className="hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out" style={{ textDecoration: 'none' }}>
              <img src={imgLogoVinpearlTheatre} alt="Vinpearl Theatre Logo" className="h-[40px] w-auto object-contain" />
            </Link>
            <p className="font-['Inter',sans-serif] font-bold leading-[20px] text-[#c08028] text-[14px]">
              Vinpearl Theatre Ocean City
            </p>
          </div>

          {/* Contact info simplified */}
          <div className="flex flex-row justify-center gap-x-[16px] text-[11px] text-gray-400 font-['Inter',sans-serif]">
            <p>Địa điểm: <span className="text-gray-200">Nhà hát Vinpearl Ocean City</span></p>
          </div>

        </div>
      </div>

      {/* Lower part: Copyright */}
      <div className="relative shrink-0 w-full min-h-[30px] flex items-center bg-[#151515] py-[8px] border-t border-[#333]">
        <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-[16px] gap-y-[4px] relative text-[10px] text-gray-500 font-['Inter',sans-serif] text-center">
          <p>
            Bản quyền © 2026 <span className="text-[#c08028] font-medium">Vinpearl Theatre Ocean City</span>.
          </p>
        </div>
      </div>

    </div>
  );
}
