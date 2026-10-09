"""Pack unchanged reference images into one board for the five-input tool limit."""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', required=True)
parser.add_argument('inputs', nargs='+')
args = parser.parse_args()
images = []
for source in args.inputs:
    with Image.open(source) as image:
        images.append(image.convert('RGBA'))
board = Image.new('RGBA', (sum(im.width for im in images), max(im.height for im in images)), (245, 245, 245, 255))
left = 0
for image in images:
    board.alpha_composite(image, (left, 0))
    left += image.width
output = Path(args.output)
output.parent.mkdir(parents=True, exist_ok=True)
board.save(output)
print(output)
