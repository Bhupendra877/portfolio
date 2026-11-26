/**
 * Original spider-web line art (radial spokes + sagging rings), used as corner decoration.
 * Drawn from scratch — not a reproduction of any logo.
 */
const SPOKES = 9;
const RINGS = [0.16, 0.3, 0.45, 0.6, 0.76, 0.92];

function webPath(size: number) {
  // web anchored in the top-left corner, fanning across a quarter circle
  const angles = Array.from({ length: SPOKES }, (_, i) => (i / (SPOKES - 1)) * (Math.PI / 2));
  let d = "";
  for (const a of angles) d += `M0 0 L${(Math.cos(a) * size).toFixed(1)} ${(Math.sin(a) * size).toFixed(1)} `;
  for (const r of RINGS) {
    const R = r * size;
    angles.forEach((a, i) => {
      const x = Math.cos(a) * R, y = Math.sin(a) * R;
      if (i === 0) { d += `M${x.toFixed(1)} ${y.toFixed(1)} `; return; }
      // each strand sags slightly toward the centre between two spokes
      const am = (a + angles[i - 1]) / 2, sag = R * 0.86;
      d += `Q${(Math.cos(am) * sag).toFixed(1)} ${(Math.sin(am) * sag).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} `;
    });
  }
  return d;
}
const D = webPath(500);

export function WebDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`web-decor ${className}`} aria-hidden>
      <svg viewBox="0 0 500 500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d={D} />
      </svg>
    </div>
  );
}

/** A small original spider dangling on a thread (gently swings via CSS). */
export function HangingSpider() {
  return (
    <div className="hanging-spider" aria-hidden>
      <div className="thread" />
      <svg viewBox="0 0 40 40" fill="currentColor">
        <ellipse cx="20" cy="15" rx="5" ry="5.5" />
        <ellipse cx="20" cy="25" rx="7" ry="8.5" />
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14 20 Q6 15 3 8" /><path d="M14 23 Q5 22 1 18" /><path d="M14 27 Q5 29 2 34" /><path d="M15 30 Q9 35 8 40" />
          <path d="M26 20 Q34 15 37 8" /><path d="M26 23 Q35 22 39 18" /><path d="M26 27 Q35 29 38 34" /><path d="M25 30 Q31 35 32 40" />
        </g>
      </svg>
    </div>
  );
}
