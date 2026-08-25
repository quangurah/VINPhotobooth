import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

backup_dir = r'e:\msb\tapchidisan\MSB-TẠP CHÍ DI SẢN_RVSE.1505 (Copy)'

for root, dirs, files in os.walk(backup_dir):
    for f in files:
        if f.endswith('.html') or f.endswith('.tsx'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    c = file.read()
                if 'âœ“' in c:
                    print('Found tick in:', path)
                if 'â€‹' in c:
                    print('Found zwsp in:', path)
                    
                    matches = re.finditer(r'<p[^>]*>â€‹</p>', c)
                    for m in matches:
                        start = max(0, m.start() - 100)
                        end = min(len(c), m.end() + 100)
                        print('---')
                        print(c[start:end])
                        print('---')
            except:
                pass
