import os
import re

file_path = r'e:\msb\tapchidisan\trang chủ\src\imports\1MsbHomeBanner\1MsbHomeBanner.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports if they don't exist
if 'import imgBtnSoSanh' not in content:
    import_statements = '''import imgPlaceholder9 from "./dd758f6372c0d79344aab17fe69e579a05edbac0.png";
import imgBtnSoSanh from "./123.png";
import imgBtnDangKy from "./CTA.png";'''
    content = content.replace('import imgPlaceholder9 from "./dd758f6372c0d79344aab17fe69e579a05edbac0.png";', import_statements)

def replace_button(match):
    name = match.group(1)
    new_html = f'''function {name}() {{
  return (
    <div className="content-stretch flex gap-[6px] md:gap-[12px] items-center relative shrink-0 w-full" data-name="Button">
      <img src={{imgBtnSoSanh}} alt="So sánh" className="flex-1 min-w-0 object-contain cursor-pointer hover:scale-105 active:scale-95 transition-transform" />
      <img src={{imgBtnDangKy}} alt="Đăng ký" className="flex-1 min-w-0 object-contain cursor-pointer hover:scale-105 active:scale-95 transition-transform" />
    </div>
  );
}}'''
    return new_html

# Replace all Button functions
content = re.sub(r'function (Button\d*)\(\) \{[\s\S]*?return \([\s\S]*?<div[^>]*data-name="Button"[\s\S]*?</div>[\s\S]*?\);\s*\}', replace_button, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated buttons to images")
