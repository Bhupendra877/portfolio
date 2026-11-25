# Assets still required (not supplied / cannot be generated in code)

These are the items that prevent an exact match with the original reference. Everything else is real code.

## 1. Footer illustrations — REQUIRED for the intended look
The built-in characters are procedural SVG fallbacks and are **not** the detailed, manga-style hand-inked art of the reference.
Provide ~25–40 transparent PNG/WebP/SVG illustrations (black ink on transparent, organic outlines, folds, expressive faces):

| Placement id | Role | Suggested size |
|---|---|---|
| `hero` | Full-body central developer, mostly black clothing | ~900 × 2200 |
| `fb0`, `fb1` | Full-body mid-ground characters | ~600 × 1500 |
| `f0`–`f3` | Large foreground busts (cropped by the bottom edge) | ~900 × 1100 |
| `m0`–`m5` | Mid-ground busts | ~700 × 850 |
| `b0`–`b8` | Small background busts | ~500 × 600 |

Put files in `public/illustrations/crowd/` and register them in `CROWD_ASSETS` (`src/components/illustrations/crowd.ts`).
Placements/sizes/depths are in the same file; add more entries to `placements` for additional characters.

## 2. Portrait
Real black-and-white photograph (4:5), e.g. `public/portraits/portrait.jpg`, then set `profile.portrait`.

## 3. Project screenshots
Add real screenshots under `public/projects/` and list them in `images: [...]` on each project in `src/data/projects.ts`.

## 4. Fonts
The reference font is unknown; Inter Tight (display) + Inter (body) + IBM Plex Mono are used as the closest freely available match.

## 5. Personal content
All text in `src/data/*` is placeholder; replace it with verified information.
