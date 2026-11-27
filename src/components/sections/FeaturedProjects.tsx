"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { profile } from "@/data/profile";
import AnimatedText from "@/components/ui/AnimatedText";
import { reveal, revealChildren } from "@/components/ui/Reveal";
import ProjectFolder from "@/components/interactive/ProjectFolder";
import dynamic from "next/dynamic";

// Case-study panel code is only fetched when a folder is opened.
const ProjectPanel = dynamic(() => import("@/components/interactive/ProjectPanel"), { ssr: false });

export default function FeaturedProjects() {
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

  return (
    <section id="projects" className="projects-section wrap">
      <div className="section-head" style={{ alignItems: "flex-start" }}>
        <AnimatedText lines={["Featured", "Projects"]} className="h-section" />
        <a {...reveal(0.1)} href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-link" style={{ marginTop: 40 }}>GitHub <span className="arrow"><ArrowUpRight size={12} /></span></a>
      </div>
      <p {...reveal()} className="projects-intro">Independent projects and professional work. Open a folder to explore a project or case study.</p>

      <ul ref={grid} className="project-folder-grid" {...revealChildren()}>
        {projects.map((p) => (
          <li key={p.id}><ProjectFolder project={p} expanded={sel?.id === p.id} onToggle={toggle} /></li>
        ))}
      </ul>
      <div className="folder-arrows" aria-label="Browse projects" {...reveal()}>
        <span className="folder-arrows-count" aria-live="polite">{String(Math.min(pos.i + 1, projects.length)).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        <button onClick={() => slide(-1)} disabled={pos.start} aria-label="Previous project"><ArrowLeft size={18} /></button>
        <button onClick={() => slide(1)} disabled={pos.end} aria-label="Next project"><ArrowRight size={18} /></button>
      </div>
      {sel && <ProjectPanel key={sel.id} project={sel} onClose={() => setSel(null)} />}
    </section>
  );
}
