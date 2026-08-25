import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk(r'e:\msb\tapchidisan'):
    # skip node_modules and .git
    if 'node_modules' in root or '.git' in root or '.next' in root:
        continue
    for f in files:
        if f.endswith('.tsx') or f.endswith('.jsx') or f.endswith('.html'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    c = file.read()
                if 'âœ“' in c:
                    print('Found tick in:', path)
                if 'leading-[22px] font-bold' in c:
                    print('Found leading in:', path)
                if 'text-[14px] sm:text-[16px] md:text-[18px]' in c:
                    print('Found text class in:', path)
            except:
                pass
