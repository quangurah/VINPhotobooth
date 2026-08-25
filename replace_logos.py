import os, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

files = glob.glob(r'e:\msb\tapchidisan\trang chủ\src\**\*.tsx', recursive=True)
count = 0
for f in files:
    content = open(f, encoding='utf-8').read()
    if 'logo-msb-white.svg' in content:
        new_content = content.replace('logo-msb-white.svg', 'msb352.svg')
        open(f, 'w', encoding='utf-8').write(new_content)
        n = content.count('logo-msb-white.svg')
        count += n
        print(f"  Replaced {n} instance(s) in {os.path.basename(f)}")

print(f"\nTotal: {count} replacements")
