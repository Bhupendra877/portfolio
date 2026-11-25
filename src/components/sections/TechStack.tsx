"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { skillGroups } from "@/data/skills";
import AnimatedText from "@/components/ui/AnimatedText";

export default function TechStack() {
  const root = useRef<HTMLElement>(null);

  useGSAPAnimation(root, () => {
    const el = root.current!;
    gsap.from(el.querySelectorAll("[data-head]"), { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 75%", once: true } });
    el.querySelectorAll<HTMLElement>(".skills-specimen").forEach((g) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: g, start: "top 88%", once: true } });
      tl.from(g, { borderTopColor: "transparent", duration: 0.4 })
        .from(g.querySelectorAll("h3, .skills-specimen-note"), { y: 22, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0)
        .from(g.querySelectorAll("li"), { y: 16, opacity: 0, duration: 0.55, stagger: 0.045, ease: "power3.out" }, 0.25);
    });
  });

  return (
    <section id="skills" ref={root} className="skills-section wrap">
      <div className="section-head skills-heading">
        <AnimatedText lines={["Tech Stack"]} className="h-section" />
        <p data-head>The tools behind<br />my work.</p>
      </div>
      <div className="skills-specimens">
        {skillGroups.map((g) => (
          <div key={g.id} className="skills-specimen">
            <h3>{g.title}</h3>
            <p className="skills-specimen-note">{g.description}</p>
            <ul className="skills-type-mosaic">
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
