import type { CharacterSpec } from "./Character";

/** 24 bust characters + 1 featured full-body character. Fully replaceable. */
export const busts: CharacterSpec[] = [
  { hair: "short", hairTone: "ink", top: "hoodie", topTone: "gray", face: "smile" },
  { hair: "bun", hairTone: "ink", top: "collar", topTone: "ink", face: "grin" },
  { hair: "curly", hairTone: "ink", top: "tee", topTone: "light", face: "smirk", glasses: "round" },
  { hair: "cap", hairTone: "gray", top: "jacket", topTone: "ink", face: "flat" },
  { hair: "long", hairTone: "ink", top: "stripes", topTone: "white", face: "smile" },
  { hair: "afro", hairTone: "ink", top: "hoodie", topTone: "light", face: "open" },
  { hair: "bald", hairTone: "ink", top: "tee", topTone: "ink", face: "smirk", glasses: "square", beard: true },
  { hair: "bob", hairTone: "gray", top: "collar", topTone: "light", face: "smile" },
  { hair: "spiky", hairTone: "ink", top: "jacket", topTone: "gray", face: "grin" },
  { hair: "beanie", hairTone: "ink", top: "hoodie", topTone: "ink", face: "flat", beard: true },
  { hair: "short", hairTone: "gray", top: "stripes", topTone: "gray", face: "open", glasses: "round" },
  { hair: "long", hairTone: "gray", top: "tee", topTone: "ink", face: "smirk" },
  { hair: "curly", hairTone: "gray", top: "collar", topTone: "ink", face: "smile" },
  { hair: "bun", hairTone: "gray", top: "hoodie", topTone: "white", face: "grin", glasses: "square" },
  { hair: "cap", hairTone: "ink", top: "tee", topTone: "gray", face: "smile" },
  { hair: "bob", hairTone: "ink", top: "jacket", topTone: "light", face: "flat", glasses: "round" },
  { hair: "afro", hairTone: "gray", top: "stripes", topTone: "ink", face: "smile" },
  { hair: "spiky", hairTone: "gray", top: "hoodie", topTone: "ink", face: "smirk" },
  { hair: "short", hairTone: "ink", top: "collar", topTone: "white", face: "grin", beard: true },
  { hair: "bald", hairTone: "ink", top: "hoodie", topTone: "light", face: "open" },
  { hair: "beanie", hairTone: "gray", top: "jacket", topTone: "ink", face: "smile" },
  { hair: "long", hairTone: "ink", top: "collar", topTone: "gray", face: "grin", glasses: "round" },
  { hair: "curly", hairTone: "ink", top: "hoodie", topTone: "gray", face: "flat" },
  { hair: "cap", hairTone: "gray", top: "stripes", topTone: "light", face: "open", beard: true },
];

export const featured: CharacterSpec = { hair: "short", hairTone: "ink", top: "jacket", topTone: "ink", face: "smile", glasses: "round", full: true };
export const fullBodies: CharacterSpec[] = [
  { hair: "bun", hairTone: "ink", top: "hoodie", topTone: "light", face: "grin", full: true },
  { hair: "afro", hairTone: "ink", top: "stripes", topTone: "white", face: "smirk", full: true },
];

/**
 * Drop-in artwork: map a placement id (e.g. "hero", "f0", "m3", "b5") to a transparent PNG/WebP/SVG in
 * /public/illustrations/crowd/. Any id listed here is rendered from that file instead of the built-in
 * procedural fallback. See ASSETS.md for the full list of required illustrations.
 */
export const CROWD_ASSETS: Record<string, string> = {
  hero: "/illustrations/crowd/hero.webp", // the owner's own avatar (centre of the crowd)
};

export type Placement = { id: string; spec: CharacterSpec; left: number; bottom: number; width: number; depth: number; row: "back" | "mid" | "front" | "hero"; peek?: boolean };

// Denser composition (left/bottom/width are % of the stage). Back and mid rows overlap; front row is cropped by the bottom edge.
const back = Array.from({ length: 17 }, (_, i): Placement => ({ id: `b${i}`, spec: busts[i % busts.length], left: -3 + i * 6.3, bottom: 46 + (i % 3) * 3.5, width: 8.2, depth: 0.3, row: "back", peek: i % 5 === 1 }));
const mid = Array.from({ length: 12 }, (_, i): Placement => ({ id: `m${i}`, spec: busts[(i + 9) % busts.length], left: -2 + i * 9, bottom: 25 + (i % 2) * 5, width: 11, depth: 0.6, row: "mid", peek: i === 2 || i === 8 }));
const front = [-3, 8.5, 21, 33.5, 56, 68, 80.5, 92].map((left, i): Placement => ({ id: `f${i}`, spec: busts[(i + 14) % busts.length], left, bottom: -14 - (i % 2) * 5, width: 13.5, depth: 1, row: "front" }));

export const placements: Placement[] = [
  ...back, ...mid, ...front,
  { id: "fb0", spec: fullBodies[0], left: 16, bottom: -1, width: 7, depth: 0.8, row: "mid" },
  { id: "fb1", spec: fullBodies[1], left: 76, bottom: -1, width: 7, depth: 0.8, row: "mid" },
  // featured central full-body character (mostly black clothing)
  { id: "hero", spec: featured, left: 44.75, bottom: -1.5, width: 10.5, depth: 0.9, row: "hero" },
];
