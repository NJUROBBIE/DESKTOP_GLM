"""Register standard rows using the bundled Pets geometry functions.

The jump landing provides scale/headroom. Each other row gets ONE scale for
every pose. The jump row itself is untouched, retaining its airborne offsets.
Run official extraction first and official inspection/composition afterwards.
"""
import argparse
import json
import sys
from pathlib import Path
from PIL import Image


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--skill-dir', type=Path, required=True)
    parser.add_argument('--frames-root', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    args = parser.parse_args()
    sys.path.insert(0, str(args.skill_dir / 'scripts'))
    from assemble_extended_atlas import cell_geometry, normalize_cell_to_geometry
    from extract_strip_frames import ROW_FRAME_COUNTS
    reference = Image.open(args.frames_root / 'jumping' / '04.png').convert('RGBA')
    target = cell_geometry(reference)
    report = {'method': 'bundled normalize_cell_to_geometry, one scale per row',
              'target_height': target.height, 'target_bottom': target.bottom, 'rows': []}
    for state in ROW_FRAME_COUNTS:
        if state == 'jumping':
            report['rows'].append({'state': state, 'scale': 1, 'airborne_offsets_preserved': True})
            continue
        files = sorted((args.frames_root / state).glob('*.png'))
        cells = [Image.open(p).convert('RGBA') for p in files]
        scale = target.height / max(cell_geometry(c).height for c in cells)
        for file, cell in zip(files, cells):
            normalize_cell_to_geometry(cell, target, scale).save(file)
        report['rows'].append({'state': state, 'scale': scale})
    args.report.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report))


if __name__ == '__main__':
    main()
