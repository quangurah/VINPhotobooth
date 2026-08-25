import os
import re

file_path = r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_frame17 = '''function Frame17() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full pointer-events-none">
      <div className="flex flex-row items-center justify-center w-full size-full pointer-events-none">
        <div className="content-stretch flex items-center justify-center w-full pt-[108px] relative size-full pointer-events-none">
          <div className="pointer-events-auto hidden md:flex md:flex-col -translate-y-1/2 absolute backdrop-blur-[2px] bg-[rgba(255,255,255,0.4)] content-stretch items-center justify-center left-0 overflow-clip rounded-[32px] size-[48px] top-[calc(50%+52px)] cursor-pointer hover:scale-110 hover:bg-white/60 active:scale-95 transition-all duration-300 ease-in-out" data-name="scroll">
            <div className="relative shrink-0 size-[32px]" data-name="left">
              <div className="absolute inset-[20.83%_33.85%]" data-name="Union">
                <svg className="absolute block inset-0 size-full rotate-180" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 18.6667">
                  <path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L10.0404 8.62623C10.431 9.01675 10.431 9.64992 10.0404 10.0404L1.70711 18.3738C1.31658 18.7643 0.683417 18.7643 0.292893 18.3738C-0.0976311 17.9832 -0.0976311 17.3501 0.292893 16.9596L7.91912 9.33333L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" fill="#f4600c" id="Union"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="pointer-events-auto hidden md:flex md:flex-col -translate-y-1/2 absolute backdrop-blur-[2px] bg-[rgba(255,255,255,0.4)] content-stretch items-center justify-center overflow-clip right-0 rounded-[32px] size-[48px] top-[calc(50%+52px)] cursor-pointer hover:scale-110 hover:bg-white/60 active:scale-95 transition-all duration-300 ease-in-out" data-name="scroll">
            <div className="relative shrink-0 size-[32px]" data-name="right">
              <div className="absolute inset-[20.83%_33.85%]" data-name="Union">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 18.6667">
                  <path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L10.0404 8.62623C10.431 9.01675 10.431 9.64992 10.0404 10.0404L1.70711 18.3738C1.31658 18.7643 0.683417 18.7643 0.292893 18.3738C-0.0976311 17.9832 -0.0976311 17.3501 0.292893 16.9596L7.91912 9.33333L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" fill="#f4600c" id="Union"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}'''

content = re.sub(r'function Frame17\(\) \{[\s\S]*?return \([\s\S]*?</div>\s*\);\s*\}', new_frame17, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Frame17")
