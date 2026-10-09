# Final high-knee march repair QA

Selected candidate: decoded/running-right.png
Prior row preserved: qa/rows/running-right/pre-march.png
Generation: one successful built-in image_gen generation. An initial six-reference request was rejected before generation because the tool accepts at most five paths. All three original references were then packed without rescaling into original-references-board.png; the board, guide, canonical base, and preserved current row were supplied together.
Prompt: current section at the top of prompt-used.md.

## Bundled structural results

extract_strip_frames.py --method auto: exit 0, ok true.
inspect_frames.py --require-components: exit 0, ok true, no errors or warnings.
Eight frames extracted through components; each is 192x208, each visible bounding box has top 5 and exclusive bottom 203, and all have zero edge pixels. All poses remain complete and connected. These checks do not establish gait semantics.

## Visual review of source and all eight extracted frames

PASS: exactly eight separated full-body poses, all heads/noses/cap brims face screen-right. The black cap, shaggy hair, olive shirt, backpack, loose trousers, beige-soled dark shoes and canonical character identity remain recognizable and consistent. Scale is stable. No copied guide marks, labels, props, or detached motion effects appear.

FAIL: the required near/far leg exchange is visibly absent, not merely hidden by occlusion. In both phases 1 and 5, the charcoal foreground thigh rises to a bent knee on screen-right, while the darker-black rear leg remains planted. The raised beige sole is visually around y=160-166 versus the planted sole around y=194-199 in the native cells (approximate visual readings, not computed landmark measurements). Both phases therefore show the same leg and same height ordering.

In both phases 2 and 6, the same charcoal foreground leg extends forward and upward; its sole rises diagonally above the planted darker-black foot. Phases 3 and 7 again show the charcoal foreground shoe landing on screen-right with the darker rear heel lifted. The knee/shoe trajectory repeats instead of switching anatomical leg roles. Phase 8 differs from phase 4 by a more visible trailing foot, but this does not establish the required exchange. The near arm remains back during both lift/extension groups 1-2 and 5-6, also failing the intended counterphase reversal between the two halves.

Concern: thin magenta fringe remains on extracted outlines, consistent with the report's chroma-adjacent-pixel counts of 99-150 per frame. The parent pipeline's final edge despill remains necessary. No final atlas or upload validation is claimed.

Verdict: STRUCTURAL PASS; REQUESTED ALTERNATING MARCH SEMANTICS FAIL. Do not label this row approved on the basis of structural inspection alone. No additional generation performed under the one-generation limit. Only running-right source and its own QA files were changed.
