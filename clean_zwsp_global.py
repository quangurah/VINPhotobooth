import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def remove_zwsp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_len = len(content)
                    
                    # Remove full paragraphs that only contain zero width spaces or literal "â€‹"
                    content = re.sub(r'<p[^>]*>[\s\u200b]*</p>\s*', '', content)
                    content = re.sub(r'<p[^>]*>â€‹</p>\s*', '', content)
                    
                    # Also strip any stray zero-width space from text just in case
                    content = content.replace('â€‹', '')
                    content = content.replace('\u200b', '')
                    
                    if len(content) != original_len:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f'Cleaned zwsp from {path}')
                except Exception as e:
                    print(f'Error on {path}: {e}')

remove_zwsp(r'e:\msb\tapchidisan\trang chủ\src')
