import os
import re

path = r'e:\msb\tapchidisan\trang chủ\src\imports\2DiSảnHome2-1\2DiSảnHome2.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('âœ“', '✓')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed tick mark")
