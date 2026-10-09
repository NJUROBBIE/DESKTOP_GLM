# Standard-row source and normalized contact review

All nine source rows were extracted with the bundled component-aware extractor and passed the bundled frame inspector. The normalized contact sheet contains 57 complete frames and 15 empty cells, with no clipping or detached effects visible. These are standard-row findings, not a final v2 upload approval.

| State | Observed movement |
|---|---|
| idle | Open eyes, small blink/closed eyes, gentle head tilt and return; feet stay planted. |
| running-right | Three-quarter heads point right. Foreground shoe exposes its sole on 1/5, opposite foot lifts behind on 3/7, with planted transitions. |
| running-left | Independently generated left-facing counterpart; opposite shoe phases are visible, chest marking remains on anatomical left chest. |
| waving | Screen-left hand rises beside face, opens and returns; no detached wave marks. |
| jumping | Crouch, lift, raised arms and airborne peak, descent, planted settle. Ground bottom is 202 and peak bottom is 159 before final encoding. |
| failed | Head bows, shoulders lower, hand touches forehead, then returns. |
| waiting | One palm asks upward with a mild head tilt, blink and expectant face. |
| running | Hand supports chin, head and eyes shift in concentration; no locomotion. |
| review | Hands behind back, torso leans forward, focused eyes close briefly, then returns. |

Shared registration uses the bundled geometry normalizer with one scale per row, matching the jump landing's 162-pixel height and 202-pixel foot baseline. Jump offsets remain unchanged. Contact-sheet comparison shows coherent body/head size and anchored lower bodies; lower head height during a bow is intentional. GIF loops were rendered using the bundled preview renderer in the isolated Pillow 12.3.0 runtime (the system Pillow 11.0 encoder had a palette error). Final encoded-sheet review and one-pass chroma cleanup are still required.
