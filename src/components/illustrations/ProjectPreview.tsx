/** Original grayscale UI mockups used as stand-in project screenshots. Replace with real screenshots. */
export default function ProjectPreview({ variant, tone = "light" }: { variant: number; tone?: "light" | "dark" }) {
  const ink = tone === "light" ? "#1a1919" : "#f5f4f2";
  const bg = tone === "light" ? "#ecebed" : "#222020";
  const mid = tone === "light" ? "#bdbcbe" : "#4a4848";
  return (
    <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label="Project preview placeholder" preserveAspectRatio="xMidYMin slice">
      <rect width="300" height="380" fill={bg} />
      <rect width="300" height="26" fill={ink} />
      {[0, 1, 2].map((i) => <circle key={i} cx={14 + i * 12} cy="13" r="3" fill={bg} />)}
      {variant === 0 && (<g>
        {[0, 1, 2].map((i) => (<g key={i}><rect x="24" y={52 + i * 88} width="90" height="46" fill="none" stroke={ink} strokeWidth="2" /><rect x="186" y={52 + i * 88} width="90" height="46" fill={i === 1 ? ink : "none"} stroke={ink} strokeWidth="2" /><path d={`M114 ${75 + i * 88} H186`} stroke={ink} strokeWidth="2" strokeDasharray="5 4" /></g>))}
      </g>)}
      {variant === 1 && (<g>
        <path d="M20 190 L70 140 L110 160 L160 90 L210 120 L280 60" fill="none" stroke={ink} strokeWidth="3" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={24 + i * 33} y={330 - (20 + ((i * 37) % 70))} width="22" height={20 + ((i * 37) % 70)} fill={i % 3 ? mid : ink} />)}
        <rect x="20" y="210" width="260" height="1.5" fill={mid} />
      </g>)}
      {variant === 2 && (<g>
        <rect x="24" y="50" width="120" height="150" fill="none" stroke={ink} strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x="34" y={62 + i * 18} width={70 + ((i * 29) % 60)} height="6" fill={i === 2 ? ink : mid} />)}
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="164" y={56 + i * 36} width="112" height="26" fill={i === 1 ? ink : "none"} stroke={ink} strokeWidth="2" />)}
        <circle cx="84" cy="280" r="40" fill="none" stroke={ink} strokeWidth="3" /><path d="M84 280 L84 240 A40 40 0 0 1 120 296Z" fill={ink} />
      </g>)}
      {variant === 3 && (<g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (<g key={i}><rect x="20" y={46 + i * 44} width="260" height="34" fill={i % 2 ? "none" : mid} stroke={ink} strokeWidth="1.5" /><rect x="30" y={58 + i * 44} width={60 + ((i * 41) % 90)} height="8" fill={ink} /><rect x="230" y={58 + i * 44} width="38" height="8" fill={ink} opacity=".5" /></g>))}
      </g>)}
    </svg>
  );
}
