# Running-right simplified four-phase repair review

Candidate: decoded/running-right.png.
Verdict: BLOCKED for leg-phase semantics; not approved for final assembly.

One built-in ImageGen call used for this repair. All five manifest images were viewed and attached. Full actual prompt is recorded in prompt-used.md under "Simplified four-phase repair". Prior selected row preserved at qa/rows/running-right/pre-four-phase-repair.png. Original generated image retained at C:/Users/15156/.codex/generated_images/01a11f1e-2ba8-7071-bc20-49cdc4b38eba/exec-9a111b56-a80e-4956-a47d-d05730527f27.png.

Actual bundled results: extract_strip_frames.py --method auto returned ok: true with component extraction; inspect_frames.py --require-components returned ok: true, eight frames, errors [], warnings []. Review saved at review.json. All eight extracted frames and source row visually inspected.

Visual positives:
- Eight separated complete connected poses; no clipping, guide markings, text, scenery or detached effects.
- Black cap with beige mark, black hair, olive shirt, backpack, loose black trousers and beige-soled shoes remain consistent.
- Every head, nose and cap brim faces screen-right. Head height and scale remain stable.
- Visible near-arm hand positions relative to hip clearly read RIGHT, CENTER, LEFT, CENTER, RIGHT, CENTER, LEFT, CENTER. Frames 1/5 visibly swing forward; 3/7 visibly swing backward from the same camera-side shoulder.
- Frame 6 contains the requested blink. Feet remain at a common baseline, with no clearly wholly airborne pose.

Blocking visual concern:
- Opposite arm-swing frames 1 versus 3 (and 5 versus 7) retain essentially the same spread-leg silhouette and trouser overlap. Near/far leg shading is too similar to demonstrate that the near foot changed from behind/left to ahead/right.
- Passing poses 2 versus 4 (and 6 versus 8) also appear nearly identical rather than clearly swapping the supporting leg.
- Therefore the arm cadence repair succeeded, but strong opposite near-foot phase is still not visually verifiable. Structural ok does not certify gait semantics.

Additional concern: thin magenta fringes remain on extracted edges; eventual parent assembly still needs the contract's single final despill pass.

No additional generation attempted. No main manifest, other state files, Library organization, upload or pet records changed.
