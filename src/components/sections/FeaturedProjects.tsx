"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { projects, type Project } from "@/data/projects";
import { profile } from "@/data/profile";
import AnimatedText from "@/components/ui/AnimatedText";
import ProjectFolder from "@/components/interactive/ProjectFolder";
import ProjectPanel from "@/components/interactive/ProjectPanel";

export default function FeaturedProjects() {
  const root = useRef<HTMLElement>(null);
  const [sel, setSel] = useState<Project | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState({ i: 0, start: true, end: false });

  // Carousel arrows (phones/tablets, where the folder row scrolls sideways)
  useEffect(() => {
    const el = grid.current!;
    const update = () => {
      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 20 : el.clientWidth;
      setPos({ i: Math.round(el.scrollLeft / step), start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const slide = (dir: 1 | -1) => {
    const el = grid.current!;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + 20), behavior: "smooth" });
  };
  const toggle = (p: Project) => setSel((cur) => (cur?.id === p.id ? null : p));

  useGSAPAnimation(root, () => {
    gsap.from(root.current!.querySelectorAll("[data-head]"), { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
    gsap.from(root.current!.querySelectorAll("[data-folder]"), { y: 70, opacity: 0, duration: 1, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: ".project-folder-grid", start: "top 88%", once: true } });
  });

  return (
    <section id="projects" ref={root} className="projects-section wrap">
      <div className="section-head" style={{ alignItems: "flex-start" }}>
        <AnimatedText lines={["Featured", "Projects"]} className="h-section" />
        <a data-head href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-link" style={{ marginTop: 40 }}>GitHub <span className="arrow"><ArrowUpRight size={12} /></span></a>
      </div>
      <p data-head className="projects-intro">Independent projects and professional work. Open a folder to explore a project or case study.</p>

      <ul ref={grid} className="project-folder-grid">
        {projects.map((p) => (
          <li key={p.id} data-folder><ProjectFolder project={p} expanded={sel?.id === p.id} onToggle={toggle} /></li>
        ))}
      </ul>
      <div className="folder-arrows" aria-label="Browse projects">
        <span className="folder-arrows-count" aria-live="polite">{String(Math.min(pos.i + 1, projects.length)).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        <button onClick={() => slide(-1)} disabled={pos.start} aria-label="Previous project"><ArrowLeft size={18} /></button>
        <button onClick={() => slide(1)} disabled={pos.end} aria-label="Next project"><ArrowRight size={18} /></button>
      </div>
      {sel && <ProjectPanel key={sel.id} project={sel} onClose={() => setSel(null)} />}
    </section>
  );
}
