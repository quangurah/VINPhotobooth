import os
import re

file_path = r'e:\msb\tapchidisan\trang chủ\src\imports\4DiSảnStep2-1\4DiSảnStep2.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count('aspect-[160/0]')
print(f'aspect-[160/0] count: {count}')

if count > 0:
    content = re.sub(r'className="[^"]*aspect-\[160/0\][^"]*"', 'className="absolute inset-0"', content)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed in target file')
