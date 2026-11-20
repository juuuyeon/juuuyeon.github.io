"""Record real raster dimensions; never resample or alter project artwork."""
from pathlib import Path
from PIL import Image
import json
root = Path(__file__).resolve().parents[1]
metadata = {}
for path in sorted((root / 'public').rglob('*')):
    if path.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.gif'}:
        continue
    with Image.open(path) as image:
        metadata['/' + path.relative_to(root / 'public').as_posix()] = {
            'width': image.width, 'height': image.height,
        }
lines = [json.dumps(key, ensure_ascii=False) + ':' + json.dumps(value)
         for key, value in metadata.items()]
(root / 'src/image-metadata.json').write_text('{\n' + ',\n'.join(lines) + '\n}\n')
print(f'Recorded {len(metadata)} original image sizes')
