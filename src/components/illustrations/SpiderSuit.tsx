import { useId } from "react";

/**
 * Original "web-slinger" hero illustrations in several suit colourways.
 * Inspired by the genre (masks, big lenses, web lines) — no logos, names or emblems are reproduced.
 */
export type Suit = {
  mask: string;          // head colour
  maskWeb?: string;      // web lines on the mask (omit for a plain mask)
  body: string;          // torso / legs
  side?: string;         // side panels + arms (defaults to body)
  bodyWeb?: string;      // web lines on the chest
  lens?: string;         // lens fill
  hood?: string;         // optional hoodie hood behind the head
  stripe?: string;       // optional chest stripe
  boots?: string;        // full body only
};

export const suits: Record<string, Suit> = {
  classic: { mask: "#d7192a", maskWeb: "#0b0f24", body: "#d7192a", side: "#1b3a8c", bodyWeb: "#0b0f24", lens: "#fff", boots: "#d7192a" },
  midnight: { mask: "#16161a", maskWeb: "#d7192a", body: "#16161a", side: "#16161a", bodyWeb: "#d7192a", lens: "#fff", boots: "#d7192a" },
  shadow: { mask: "#111114", body: "#111114", side: "#2a2a30", lens: "#fff", stripe: "#f4f1ea", boots: "#111114" },
  ghost: { mask: "#f6f3ee", maskWeb: "#c9c3ba", body: "#f6f3ee", side: "#16161a", hood: "#f6f3ee", lens: "#7fd6e3", stripe: "#e2589b", boots: "#7fd6e3" },
  future: { mask: "#1d2b6b", maskWeb: "#0b0f24", body: "#1d2b6b", side: "#0b0f24", lens: "#ff3443", stripe: "#ff3443", boots: "#ff3443" },
  scarlet: { mask: "#c3161f", maskWeb: "#0b0f24", body: "#1b3a8c", side: "#1b3a8c", hood: "#c3161f", lens: "#fff", stripe: "#c3161f", boots: "#1b3a8c" },
  noir: { mask: "#3a3a40", maskWeb: "#111114", body: "#2a2a30", side: "#111114", bodyWeb: "#111114", lens: "#c9c9cf", boots: "#111114" },
};

const INK = "#0b0f24";
const st = { stroke: INK, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Radial web centred near the nose: spokes + rings, clipped by the caller. */
function webLines(cx: number, cy: number, r: number, spokes = 12) {
  let d = "";
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    d += `M${cx} ${cy} L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)} `;
  }
  for (const k of [0.28, 0.52, 0.76, 1]) d += `M${cx + r * k} ${cy} A${r * k} ${r * k * 0.95} 0 1 0 ${cx + r * k - 0.01} ${cy} `;
  return d;
}

export default function SpiderSuit({ suit, full = false, label }: { suit: Suit; full?: boolean; label?: string }) {
  const id = useId().replace(/:/g, "");
  const side = suit.side ?? suit.body;
  const torso = full
    ? "M40 300 L42 204 C44 182 70 172 100 172 C130 172 156 182 158 204 L160 300 Z"
    : "M8 240 C8 192 40 172 100 172 C160 172 192 192 192 240 Z";
  return (
    <svg viewBox={full ? "0 0 200 500" : "0 0 200 240"} role="img" aria-label={label ?? "Illustrated masked web-slinger"} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`h${id}`}><ellipse cx="100" cy="100" rx="41" ry="49" /></clipPath>
        <clipPath id={`t${id}`}><path d={torso} /></clipPath>
      </defs>

      {full && (
        <g>
          <path d="M56 300 H98 L94 466 H60 Z" fill={suit.body} {...st} />
          <path d="M102 300 H144 L140 466 H106 Z" fill={suit.body} {...st} />
          <path d="M52 452 H96 L100 488 H42 Q42 470 52 452 Z" fill={suit.boots ?? suit.body} {...st} />
          <path d="M104 452 H148 Q158 470 158 488 H100 Z" fill={suit.boots ?? suit.body} {...st} />
          <path d="M44 200 C26 240 24 290 30 322 L50 322 C50 280 54 244 62 206 Z" fill={side} {...st} />
          <path d="M156 200 C174 240 176 290 170 322 L150 322 C150 280 146 244 138 206 Z" fill={side} {...st} />
          <circle cx="40" cy="332" r="11" fill={suit.mask} {...st} /><circle cx="160" cy="332" r="11" fill={suit.mask} {...st} />
        </g>
      )}

      {/* hood (behind the head) */}
      {suit.hood && <path d="M50 120 C44 52 76 34 100 34 C124 34 156 52 150 120 C150 150 136 170 100 172 C64 170 50 150 50 120 Z" fill={suit.hood} {...st} />}

      {/* torso with side panels */}
      <path d={torso} fill={suit.body} {...st} />
      <g clipPath={`url(#t${id})`}>
        {!full && <><path d="M0 172 H52 C50 200 46 222 40 240 H0 Z" fill={side} /><path d="M200 172 H148 C150 200 154 222 160 240 H200 Z" fill={side} /></>}
        {full && <><path d="M30 172 H62 C58 230 56 270 54 300 H30 Z" fill={side} /><path d="M170 172 H138 C142 230 144 270 146 300 H170 Z" fill={side} /></>}
        {suit.bodyWeb && <path d={webLines(100, 196, 120, 14)} fill="none" stroke={suit.bodyWeb} strokeWidth="1.6" opacity=".9" />}
        {suit.stripe && <path d="M84 172 L100 230 L116 172 Z" fill={suit.stripe} opacity=".95" />}
      </g>
      <path d={torso} fill="none" {...st} />
      {/* neck */}
      <path d="M86 138 V176 Q100 188 114 176 V138 Z" fill={suit.mask} {...st} />

      {/* masked head */}
      <ellipse cx="100" cy="100" rx="41" ry="49" fill={suit.mask} {...st} />
      {suit.maskWeb && (
        <g clipPath={`url(#h${id})`}>
          <path d={webLines(100, 108, 62)} fill="none" stroke={suit.maskWeb} strokeWidth="1.5" />
        </g>
      )}
      <ellipse cx="100" cy="100" rx="41" ry="49" fill="none" {...st} />
      {/* lenses */}
      <path d="M66 96 Q70 74 95 96 Q88 114 66 96 Z" fill={suit.lens ?? "#fff"} stroke={INK} strokeWidth="4.2" strokeLinejoin="round" />
      <path d="M134 96 Q130 74 105 96 Q112 114 134 96 Z" fill={suit.lens ?? "#fff"} stroke={INK} strokeWidth="4.2" strokeLinejoin="round" />
      {/* soft highlight */}
      <path d="M78 66 C86 60 96 58 104 60" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
