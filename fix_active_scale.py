import os
import re

file_path = r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace active:scale-5 with active:scale-95
content = content.replace('active:scale-5', 'active:scale-95')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated active:scale")
