import os
import re

file_path = r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the So sánh wrapper
# It looks like: className="content-stretch flex flex-[1_0_0] gap-[4px] md:gap-[8px] items-center justify-center min-w-px py-[6px] md:py-[10px] relative rounded-[8px]" data-name="CTA"
# We want to add border border-solid border-[#f4600c] cursor-pointer hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out

old_class = 'className="content-stretch flex flex-[1_0_0] gap-[4px] md:gap-[8px] items-center justify-center min-w-px py-[6px] md:py-[10px] relative rounded-[8px]"'
new_class_so_sanh = 'className="content-stretch flex flex-[1_0_0] gap-[4px] md:gap-[8px] items-center justify-center min-w-px py-[6px] md:py-[10px] relative rounded-[8px] border border-solid border-[#f4600c] cursor-pointer hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"'
new_class_dang_ky = 'className="content-stretch flex flex-[1_0_0] gap-[4px] md:gap-[8px] items-center justify-center min-w-px py-[6px] md:py-[10px] relative rounded-[8px] cursor-pointer hover:opacity-90 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-in-out"'

# We can replace them by looking at whether they have the style attribute (which indicates Đăng ký)
# For So sánh:
content = content.replace(old_class + ' data-name="CTA"', new_class_so_sanh + ' data-name="CTA"')

# For Đăng ký:
content = content.replace(old_class + ' style={{ backgroundImage:', new_class_dang_ky + ' style={{ backgroundImage:')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated buttons")
