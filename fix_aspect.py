import os

file_path = r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific aspect-[160/0] classes with absolute inset-0
content = content.replace('-translate-y-1/2 absolute aspect-[160/0] left-[-33.78px] right-[-33.78px] top-[calc(50%+0.75px)]', 'absolute inset-0')
content = content.replace('-translate-y-1/2 absolute aspect-[160/0] left-[-0.14%] right-[-0.07%] top-[calc(50%+0.1px)]', 'absolute inset-0')
content = content.replace('-translate-y-1/2 absolute aspect-[160/0] left-[0%] right-[0%] top-[calc(50%+0px)]', 'absolute inset-0')

# General replace just in case there are other variations
import re
content = re.sub(r'className="[^"]*aspect-\[160/0\][^"]*"', 'className="absolute inset-0"', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced all aspect-[160/0]")
