# Waving visual review

Selected source: `decoded/waving.png` (2170 x 725), copied from built-in image_gen output; original retained at `C:/Users/15156/.codex/generated_images/01a11c87-cb11-7630-8539-88ed70a9266a/exec-95a8260d-83ca-4c13-90c0-55bbe578a7cc.png`.

One generation, no repair attempts. All five manifest input images were inspected and attached. Exact generation prompt is saved in `prompt-used.md`.

Both bundled scripts completed with exit code 0 and `ok: true`. Extraction used components; inspection found exactly four frames, no errors, no warnings, and no edge pixels. See `review.json` and `frames/frames-manifest.json` for actual script reports.

Visual review of the generated strip and all four extracted 192 x 208 frames: four separated complete poses, preserved black cap and beige mark, black hair, olive shirt and chest mark, backpack straps, loose black trousers and beige-soled shoes. The original screen-left waving hand progresses from low to beside cheek to higher beside cap to returning near chest; elbow and wrist change while the other hand remains low. Both feet remain planted on one baseline; apparent body scale is stable. No guide markings, clipping, detached effects, or new props are visible.

Concern for parent assembly: thin magenta edge fringe remains visible in extracted frames; script reports 55–76 chroma-adjacent pixels per frame. This needs the prescribed final atlas despill pass, which has not been run by this row worker. Final atlas and animated playback acceptance remain with parent workflow.
