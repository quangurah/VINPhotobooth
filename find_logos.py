import os, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

files = glob.glob(r'e:\msb\tapchidisan\trang chủ\src\imports\**\*.tsx', recursive=True)
for f in files:
    content = open(f, encoding='utf-8').read()
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'logo-msb-white' in line or 'MSB352' in line or 'data-name="Page-2"' in line:
            print(f"{os.path.basename(f)}:{i+1} {line.rstrip()}")
