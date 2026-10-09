# Waiting row visual QA

Selected: decoded/waiting.png (built-in image generation, repair attempt 1).

Both bundled extraction and inspect_frames --require-components returned ok: true, no errors, no warnings. All six extracted frames were visually inspected.

Visual pass: exactly six full-body separated poses; connected palm-up hand and arm in each; feet planted; stable apparent scale and ground baseline; canonical black cap, shaggy black hair, olive shirt, black backpack, trousers and beige-soled shoes retained. Tan chest mark remains viewer-right in all frames. Patient palm-up asking gesture is distinct from chin-rest thinking and focused review. No guide markings, clipping, added props or detached decorative effects. Blink/wink and head tilt variation is present.

Unresolved source requirement: background is near-magenta, not uniform exact #FF00FF, despite one targeted regeneration. Selected image corners RGB: (231,15,229), (240,20,232), (230,37,223), (232,35,226); dominant RGB (245,5,241). Fine magenta fringe remains visible in extracted frames and requires the parent workflow's final chroma cleanup. Therefore the strict pure-magenta requirement has NOT passed; do not represent this row as fully accepted under that exact requirement. No further identical regeneration attempted because the same chroma issue recurred. Source poses and extraction otherwise passed.

Generation originals preserved in .codex/generated_images. Initial source preserved as qa/rows/waiting/attempt-1.png. Manifest and other states untouched; no pet upload performed.
