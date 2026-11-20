#!/usr/bin/env python3
"""Preview only the deployable build, with SPA routes and real asset 404s."""
import argparse
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--directory', type=Path, default=Path(__file__).resolve().parent.parent / 'dist')
parser.add_argument('--port', type=int, default=4178)
args = parser.parse_args()
root = args.directory.resolve()
if not (root / 'index.html').is_file():
    parser.error('Build index.html is missing; build the site first.')


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        self.byte_range = None
        raw = self.headers.get('Range')
        file = Path(self.translate_path(self.path))
        if not raw or not file.is_file():
            return super().send_head()
        size = file.stat().st_size
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', raw)
        if not match or not any(match.groups()):
            self.send_error(400, 'Invalid byte range')
            return None
        first, last = match.groups()
        start = int(first) if first else max(0, size-int(last))
        end = min(int(last), size-1) if first and last else size-1
        if start > end or start >= size:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        stream = file.open('rb')
        stream.seek(start)
        self.byte_range = end-start+1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(file)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(self.byte_range))
        self.end_headers()
        return stream

    def copyfile(self, source, output):
        if self.byte_range is None:
            return super().copyfile(source, output)
        remaining = self.byte_range
        try:
            while remaining:
                block = source.read(min(65536, remaining))
                if not block:
                    break
                output.write(block)
                remaining -= len(block)
        except (BrokenPipeError, ConnectionResetError):
            pass  # Switching films can cancel the browser's current media request.

    def translate_path(self, url):
        rel = unquote(urlsplit(url).path).lstrip('/')
        candidate = (root / rel).resolve()
        if not candidate.is_relative_to(root):
            return str(root / '__not_found__')
        if candidate.is_file():
            return str(candidate)
        if not Path(rel).suffix:
            return str(root / 'index.html')
        return str(root / '__not_found__')


print(f'Portfolio build preview: http://localhost:{args.port}', flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
