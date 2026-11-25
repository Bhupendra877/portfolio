"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectPreview from "@/components/illustrations/ProjectPreview";

type Props = { project: Project; expanded: boolean; onToggle: (p: Project) => void };

/**
 * Glass file folder. The rear cover stays put; the front cover tilts forward (rotateX) and the
 * papers fan out — driven by CSS on hover / focus / expanded, and by scroll position on touch devices.
 */
export default function ProjectFolder({ project, expanded, onToggle }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [touchOpen, setTouchOpen] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(([e]) => setTouchOpen(e.isIntersecting), { threshold: 0.95 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--folder-lean", `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`);
  };
  const shot = project.images?.[0];

  return (
    <div>
      <button
        ref={ref} type="button" className="project-folder" aria-expanded={expanded || touchOpen} aria-controls="project-details"
        aria-label={`${expanded ? "Close" : "Open"} project: ${project.title}`}
        onPointerMove={onMove} onPointerLeave={(e) => e.currentTarget.style.setProperty("--folder-lean", "0deg")}
        onClick={() => onToggle(project)}
      >
        <span className="folder-scene">
          <span className="folder-back" />
          <span className="folder-paper folder-paper-back"><span className="folder-paper-lines" /><span className="folder-paper-lines" /></span>
          <span className="folder-paper folder-paper-preview">
            <span className="shot">{shot ? <img src={shot} alt="" loading="lazy" /> : <ProjectPreview variant={project.variant} />}</span>
            <span>{project.title}</span>
          </span>
          <span className="folder-paper folder-paper-front"><span>{project.stack[0]}</span><span className="folder-paper-lines" /></span>
          <span className="folder-front">
            <span className="folder-front-title">{project.title}</span>
            <span className="folder-open-icon"><ArrowUpRight size={18} /></span>
          </span>
        </span>
      </button>
      <div className="folder-caption">
        <span>{project.year}</span>
        <button type="button" className="folder-caption-action" onClick={() => onToggle(project)} style={{ background: "none", border: 0, padding: 0 }}>
          {expanded ? "Close project" : "View project"} <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}
