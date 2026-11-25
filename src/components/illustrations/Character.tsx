/**
 * Procedural hand-inked character illustrations (grayscale SVG).
 * Each character is a standalone SVG so it can be animated independently.
 */
export type Hair = "short" | "bob" | "long" | "bun" | "curly" | "afro" | "spiky" | "cap" | "beanie" | "bald";
export type Top = "hoodie" | "tee" | "collar" | "stripes" | "jacket";
export type Face = "smile" | "flat" | "open" | "smirk" | "grin";
export type Tone = "ink" | "gray" | "light" | "white";
export type CharacterSpec = { hair: Hair; hairTone: Tone; top: Top; topTone: Tone; face: Face; glasses?: "round" | "square"; beard?: boolean; full?: boolean };

const INK = "#141313";
const fills: Record<Tone, string> = { ink: "#141313", gray: "#8e8d8f", light: "#d6d5d7", white: "#fbfbfb" };
const stroke = { stroke: INK, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function HairBack({ hair, c }: { hair: Hair; c: string }) {
  if (hair === "afro") return <circle cx="100" cy="84" r="56" fill={c} {...stroke} />;
  if (hair === "long") return <path d="M50 190 C34 70 66 38 100 38 C136 38 166 70 150 190 L128 186 L72 186 Z" fill={c} {...stroke} />;
  if (hair === "bun") return <circle cx="100" cy="34" r="17" fill={c} {...stroke} />;
  if (hair === "curly") return <g fill={c} {...stroke}>{[[62, 80, 17], [80, 58, 19], [106, 52, 19], [130, 62, 18], [144, 88, 14], [58, 104, 13], [142, 108, 12]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>;
  return null;
}
function HairFront({ hair, c }: { hair: Hair; c: string }) {
  const p = { fill: c, ...stroke };
  switch (hair) {
    case "short": case "bun": return <path d="M58 98 C54 60 80 44 102 46 C128 46 146 64 142 98 C134 82 124 72 100 70 C80 70 66 82 58 98 Z" {...p} />;
    case "bob": return <path d="M54 124 C44 66 70 44 100 44 C132 44 156 66 146 124 L136 124 C138 92 128 72 100 72 C74 72 62 92 64 124 Z" {...p} />;
    case "long": return <path d="M60 110 C54 64 80 46 102 46 C128 46 148 64 140 110 C136 86 124 72 100 72 C78 72 66 86 60 110 Z" {...p} />;
    case "curly": case "afro": return <path d="M60 92 C70 70 86 66 100 74 C114 66 132 70 140 92 C128 80 112 80 100 84 C88 80 72 80 60 92Z" {...p} />;
    case "spiky": return <path d="M58 96 L56 62 L72 74 L78 46 L94 66 L106 40 L116 66 L132 48 L134 76 L146 66 L142 98 C132 80 120 74 100 74 C80 74 68 82 58 96 Z" {...p} />;
    case "cap": return <g {...p}><path d="M58 88 C58 50 86 40 104 42 C128 44 144 60 142 88 Z" /><path d="M118 84 L170 92 C172 98 160 102 148 98 L118 94 Z" /></g>;
    case "beanie": return <g {...p}><path d="M56 82 C54 46 84 36 100 36 C124 36 146 50 144 82 Z" /><rect x="52" y="78" width="96" height="15" rx="4" /><circle cx="100" cy="30" r="8" /></g>;
    default: return null;
  }
}

function Mouth({ face }: { face: Face }) {
  const s = { fill: "none", ...stroke };
  switch (face) {
    case "smile": return <path d="M86 126 Q100 138 114 126" {...s} />;
    case "flat": return <path d="M89 128 H111" {...s} />;
    case "open": return <path d="M88 124 Q100 144 112 124 Z" fill={INK} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
    case "smirk": return <path d="M88 128 Q104 132 115 121" {...s} />;
    case "grin": return <g><path d="M84 122 Q100 144 116 122 Z" fill="#fff" {...stroke} /><path d="M86 128 H114" stroke={INK} strokeWidth="1.6" /></g>;
  }
}

function TopLayer({ top, c, full }: { top: Top; c: string; full?: boolean }) {
  const dark = c === fills.ink || c === fills.gray;
  const line = dark ? "#f2f1f3" : INK;
  const torso = full
    ? "M40 300 L42 204 C44 182 70 172 100 172 C130 172 156 182 158 204 L160 300 Z"
    : "M8 240 C8 192 40 172 100 172 C160 172 192 192 192 240 Z";
  return (
    <g>
      <path d={torso} fill={c} {...stroke} />
      {top === "hoodie" && <g fill="none" stroke={line} strokeWidth="2.6" strokeLinecap="round"><path d="M66 176 C66 204 134 204 134 176" /><path d="M92 196 V222 M108 196 V222" /></g>}
      {top === "tee" && <path d="M76 174 Q100 196 124 174" fill="none" stroke={line} strokeWidth="2.6" strokeLinecap="round" />}
      {top === "collar" && <g fill="#fbfbfb" {...stroke}><path d="M100 200 L76 172 L94 168 Z" /><path d="M100 200 L124 172 L106 168 Z" /></g>}
      {top === "stripes" && <g stroke={line} strokeWidth="2.4" strokeLinecap="round" opacity=".85">{[196, 210, 224, 238, 252, 266].filter((y) => y < (full ? 300 : 238)).map((y) => <path key={y} d={`M${full ? 48 : 20} ${y} H${full ? 152 : 180}`} />)}</g>}
      {top === "jacket" && <g fill="none" stroke={line} strokeWidth="2.6" strokeLinecap="round"><path d="M100 172 L82 240" /><path d="M100 172 L118 240" /><path d="M100 200 V300" /></g>}
    </g>
  );
}

export default function Character({ spec, label }: { spec: CharacterSpec; label?: string }) {
  const { hair, hairTone, top, topTone, face, glasses, beard, full } = spec;
  const hc = fills[hairTone];
  const tc = fills[topTone];
  const pants = topTone === "ink" ? fills.gray : fills.ink;
  return (
    <svg viewBox={full ? "0 0 200 500" : "0 0 200 240"} role="img" aria-label={label ?? "Illustrated character"} xmlns="http://www.w3.org/2000/svg">
      {full && (
        <g>
          <path d="M56 300 H98 L94 466 H60 Z" fill={pants} {...stroke} />
          <path d="M102 300 H144 L140 466 H106 Z" fill={pants} {...stroke} />
          <path d="M52 466 H96 L100 488 H42 Q42 472 52 466 Z" fill="#fbfbfb" {...stroke} />
          <path d="M104 466 H148 Q158 472 158 488 H100 Z" fill="#fbfbfb" {...stroke} />
          <path d="M44 200 C26 240 24 290 30 322 L50 322 C50 280 54 244 62 206 Z" fill={tc} {...stroke} />
          <path d="M156 200 C174 240 176 290 170 322 L150 322 C150 280 146 244 138 206 Z" fill={tc} {...stroke} />
          <circle cx="40" cy="332" r="11" fill="#fbfbfb" {...stroke} /><circle cx="160" cy="332" r="11" fill="#fbfbfb" {...stroke} />
        </g>
      )}
      <HairBack hair={hair} c={hc} />
      <TopLayer top={top} c={tc} full={full} />
      <path d="M86 138 V176 Q100 188 114 176 V138 Z" fill="#ececee" {...stroke} />
      <circle cx="59" cy="106" r="8" fill="#fbfbfb" {...stroke} /><circle cx="141" cy="106" r="8" fill="#fbfbfb" {...stroke} />
      <ellipse cx="100" cy="100" rx="41" ry="49" fill="#fbfbfb" {...stroke} />
      <path d="M124 70 C140 84 142 118 126 142" fill="none" stroke={INK} strokeWidth="1.4" opacity=".28" />
      <path d="M118 108 l10 -6 M120 116 l10 -6 M114 124 l10 -6" stroke={INK} strokeWidth="1.2" opacity=".3" />
      {beard && <path d="M60 108 C58 160 142 160 140 108 C132 140 68 140 60 108 Z" fill={hc} {...stroke} />}
      <HairFront hair={hair} c={hc} />
      <g fill={INK}>
        {face === "smile" || face === "grin" ? (
          <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round"><path d="M76 102 Q84 94 92 102" /><path d="M108 102 Q116 94 124 102" /></g>
        ) : (<><circle cx="84" cy="102" r="3.8" /><circle cx="116" cy="102" r="3.8" /></>)}
      </g>
      <g fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round">
        <path d={face === "smirk" ? "M76 88 Q84 82 94 88" : "M76 88 Q85 84 94 88"} /><path d={face === "open" ? "M106 82 Q116 78 124 86" : "M106 88 Q115 84 124 88"} />
        <path d="M100 106 Q94 118 101 120" />
      </g>
      {glasses === "round" && <g fill="none" stroke={INK} strokeWidth="3"><circle cx="84" cy="102" r="13" /><circle cx="116" cy="102" r="13" /><path d="M97 102 H103" /></g>}
      {glasses === "square" && <g fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round"><rect x="70" y="90" width="28" height="22" rx="3" /><rect x="102" y="90" width="28" height="22" rx="3" /><path d="M98 99 H102" /></g>}
      <Mouth face={face} />
    </svg>
  );
}
