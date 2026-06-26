from pathlib import Path
p = Path('app/app.gz.b64.00.txt')
q = Path('app/app.gz.b64.01.txt')
text = p.read_text() + q.read_text()
b64 = __import__('base64')
gz = __import__('gzip')
data = b64.b64decode(text)
html = gz.decompress(data).decode('utf-8')
Path('index.html').write_text(html, encoding='utf-8')
