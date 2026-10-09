from PIL import Image
from pathlib import Path

run = Path(__file__).resolve().parents[3]
images = [Image.open(run / 'references' / f'reference-{i:02d}.png').convert('RGB') for i in (1, 2, 3)]
board = Image.new('RGB', (sum(im.width for im in images), max(im.height for im in images)), '#FF00FF')
x = 0
for im in images:
    board.paste(im, (x, 0))
    x += im.width
board.save(Path(__file__).with_name('original-references-board.png'))
