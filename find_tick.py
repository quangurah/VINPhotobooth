import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

paths = [
    r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx',
    r'e:\msb\tapchidisan\trang chủ\src\imports\2DiSảnHome2-1\2DiSảnHome2.tsx',
    r'e:\msb\tapchidisan\trang chủ\src\imports\4DiSảnStep2-1\4DiSảnStep2.tsx'
]

for p in paths:
    try:
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        if 'âœ“' in c or 'leading-[22px] font-bold' in c:
            print('Found tick in:', os.path.basename(p))
    except Exception as e:
        print(e)
