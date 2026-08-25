import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

backup_dir = r'e:\msb\tapchidisan\MSB-TẠP CHÍ DI SẢN_RVSE.1505 (Copy)'
found_zip = None

for root, _, files in os.walk(backup_dir):
    for f in files:
        if f.endswith('.zip') and 'trang ch' in f.lower():
            found_zip = os.path.join(root, f)

print("Found zip:", found_zip)
