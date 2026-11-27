"use client";
import { skillGroups } from "@/data/skills";
import AnimatedText from "@/components/ui/AnimatedText";
import { reveal, revealChildren } from "@/components/ui/Reveal";

export default function TechStack() {
  return (
    <section id="skills" className="skills-section wrap">
      <div className="section-head skills-heading">
        <AnimatedText lines={["Tech Stack"]} className="h-section" />
        <p {...reveal(0.1)}>The tools behind<br />my work.</p>
      </div>
      <div className="skills-specimens">
        {skillGroups.map((g) => (
          <div key={g.id} className="skills-specimen">
            <h3 {...reveal()}>{g.title}</h3>
            <p {...reveal()} className="skills-specimen-note">{g.description}</p>
            <ul className="skills-type-mosaic" {...revealChildren()}>
              {g.skills.map((s) => (
                <li key={s.name} tabIndex={0} aria-label={`${s.name}: ${s.note}`}>
                  {s.name}
                  <span className="tip" aria-hidden>{s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
