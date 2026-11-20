#!/usr/bin/env python3
"""Create cached WebP derivatives; never change public source images."""
import argparse
import hashlib
import io
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

VERSION = 'webp-v1-png-lossless-jpeg95'


def optimize(path, public, cache, previous):
    url = '/' + path.relative_to(public).as_posix()
    stat = path.stat()
    stamp = [stat.st_size, stat.st_mtime_ns, VERSION]
    prior = previous.get(url)
    if prior and prior['stamp'] == stamp:
        if prior['status'] != 'converted' or (cache / prior['cache_file']).is_file():
            return prior
    raw = path.read_bytes()
    row = {'source': url, 'source_bytes': len(raw), 'stamp': stamp,
           'source_sha256': hashlib.sha256(raw).hexdigest()}
    with Image.open(io.BytesIO(raw)) as original:
        if getattr(original, 'n_frames', 1) > 1:
            return dict(row, status='kept-animated', output_bytes=len(raw))
        im = ImageOps.exif_transpose(original)
        im = im.convert('RGBA' if 'A' in im.getbands() or 'transparency' in im.info else 'RGB')
        row.update(width=im.width, height=im.height)
        if max(im.size) > 16383:
            return dict(row, status='kept-webp-dimension-limit', output_bytes=len(raw))
        lossless = path.suffix.lower() == '.png'
        out = io.BytesIO()
        options = {'lossless': lossless, 'quality': 95, 'method': 4, 'exact': True}
        if original.info.get('icc_profile'):
            options['icc_profile'] = original.info['icc_profile']
        im.save(out, 'WEBP', **options)
        data = out.getvalue()
        with Image.open(io.BytesIO(data)) as decoded:
            assert decoded.size == im.size, url
            if lossless:
                assert ImageChops.difference(im, decoded.convert(im.mode)).getbbox() is None, url
        if len(data) >= len(raw):
            return dict(row, status='kept-smaller-original', output_bytes=len(raw))
        filename = hashlib.sha256(url.encode()).hexdigest() + '.webp'
        target = cache / filename
        temporary = target.with_suffix('.tmp')
        temporary.write_bytes(data)
        temporary.replace(target)
        return dict(row, status='converted', target=url + '.webp', cache_file=filename,
                    output_bytes=len(data), output_sha256=hashlib.sha256(data).hexdigest(),
                    encoding='lossless' if lossless else 'quality-95')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--public', type=Path, required=True)
    parser.add_argument('--cache', type=Path, required=True)
    args = parser.parse_args()
    public, cache = args.public.resolve(), args.cache
    cache.mkdir(parents=True, exist_ok=True)
    manifest = cache / 'manifest.json'
    previous = json.loads(manifest.read_text())['images'] if manifest.exists() else []
    previous = {row['source']: row for row in previous}
    paths = sorted(p for p in public.rglob('*') if p.suffix.lower() in {'.png', '.jpg', '.jpeg'})
    rows = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(optimize, p, public, cache, previous) for p in paths]
        for future in as_completed(futures):
            rows.append(future.result())
            if len(rows) % 25 == 0:
                print(f'WebP: {len(rows)}/{len(paths)} images checked', flush=True)
    rows.sort(key=lambda row: row['source'])
    result = {'version': VERSION, 'images': rows,
              'source_bytes': sum(r['source_bytes'] for r in rows),
              'output_bytes': sum(r['output_bytes'] for r in rows),
              'converted': sum(r['status'] == 'converted' for r in rows)}
    manifest.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"WebP: {result['converted']}/{len(rows)} converted, "
          f"{result['source_bytes']/1e6:.1f} MB → {result['output_bytes']/1e6:.1f} MB", flush=True)


if __name__ == '__main__':
    main()
