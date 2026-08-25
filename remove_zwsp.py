import os
import re

file_paths = [
    r'e:\msb\tapchidisan\trang chủ\src\imports\2DiSảnHome2\2DiSảnHome2.tsx',
    r'e:\msb\tapchidisan\trang chủ\src\imports\4DiSảnStep2-1\4DiSảnStep2.tsx',
    r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx'
]

for file_path in file_paths:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove all <p> tags that contain only a zero-width space
    original_len = len(content)
    content = re.sub(r'<p[^>]*>[\u200b\s]*</p>\s*', '', content)
    content = re.sub(r'<p[^>]*>â€‹</p>\s*', '', content)

    if len(content) != original_len:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Removed empty ZWSP <p> tags from {os.path.basename(file_path)}")
