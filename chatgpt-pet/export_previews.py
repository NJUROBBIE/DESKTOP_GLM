"""Supplement the bundled Pets QA: previews use only the final encoded atlas.

Does not generate, redraw, repair, or compose any pet artwork. It extracts the
known final grid for the official preview renderer and adds playback evidence.
"""
import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('atlas', type=Path)
    parser.add_argument('--skill-dir', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    args = parser.parse_args()
    renderer = args.skill_dir / 'scripts' / 'render_animation_previews.py'
    spec = importlib.util.spec_from_file_location('pets_preview', renderer)
    official = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(official)
    atlas = Image.open(args.atlas).convert('RGBA')
    if atlas.size != (1536, 2288):
        raise ValueError('Expected the final v2 grid')
    args.output_dir.mkdir(parents=True, exist_ok=True)
    frames_dir = args.output_dir / 'encoded-frames'
    states = {}
    for row, (state, durations) in enumerate(official.ROW_DURATIONS.items()):
        target = frames_dir / state
        target.mkdir(parents=True, exist_ok=True)
        frames = []
        for col in range(len(durations)):
            frame = atlas.crop((col*192, row*208, (col+1)*192, (row+1)*208))
            frame.save(target / f'{col:02}.png')
            frames.append(frame)
        states[state] = frames
    subprocess.run([sys.executable, str(renderer), '--frames-root', str(frames_dir),
                    '--output-dir', str(args.output_dir / 'states')], check=True)

    idle_jump = states['idle'] + states['jumping'] + states['idle']
    durations = (official.ROW_DURATIONS['idle'] + official.ROW_DURATIONS['jumping']
                 + official.ROW_DURATIONS['idle'])
    official.save_preview(idle_jump, durations, args.output_dir / 'idle-jump-idle.gif')
    looks = [atlas.crop(((i%8)*192, (9+i//8)*208, (i%8+1)*192, (10+i//8)*208))
             for i in range(16)]
    official.save_preview(looks, [180]*16, args.output_dir / 'look-loop.gif')

    def at_time(frames, timing, time_ms):
        time_ms %= sum(timing)
        for i, interval in enumerate(timing):
            if time_ms < interval:
                return frames[i]
            time_ms -= interval
        return frames[-1]

    playback = []
    # Four seconds at 25 fps, all nine states shown together with explicit labels.
    for tick in range(100):
        canvas = Image.new('RGB', (576, 708), '#f3f3f0')
        draw = ImageDraw.Draw(canvas)
        for index, (state, timing) in enumerate(official.ROW_DURATIONS.items()):
            x, y = (index % 3)*192, (index // 3)*236
            draw.text((x+8, y+6), state, fill='#222222')
            frame = at_time(states[state], timing, tick*40)
            canvas.paste(frame, (x, y+28), frame)
        playback.append(canvas)
    playback[0].save(args.output_dir / 'all-states.gif', save_all=True,
                     append_images=playback[1:], duration=40, loop=0, optimize=False)
    for index in [0, 20, 45, 70]:
        playback[index].save(args.output_dir / f'still-{index*40:04}ms.png')

    import imageio_ffmpeg
    command = [imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-f', 'rawvideo', '-vcodec', 'rawvideo',
               '-pix_fmt', 'rgb24', '-s', '576x708', '-r', '25', '-i', '-', '-an',
               '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
               str(args.output_dir / 'all-states.mp4')]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL,
                               stderr=subprocess.PIPE)
    _, stderr = process.communicate(b''.join(frame.tobytes() for frame in playback))
    if process.returncode:
        raise RuntimeError(stderr.decode(errors='replace'))
    manifest = {'atlas': str(args.atlas.resolve()), 'source': 'exact-final-encoded-atlas',
                'states': list(states), 'look_frames': 16, 'all_states_duration_ms': 4000,
                'idle_jump_idle': True, 'mp4': 'all-states.mp4'}
    (args.output_dir / 'preview-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(json.dumps(manifest))


if __name__ == '__main__':
    main()
