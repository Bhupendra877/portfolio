"use client";
import { useEffect, useRef } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/data/projects";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { scrollToTarget } from "@/lib/scroll";

/** Inline case-study panel: sticky overview on the left, narrative sections on the right. */
export default function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    // context + explicit end values keep this safe under React StrictMode's double effect run
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        gsap.fromTo(el.querySelectorAll("[data-in]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out", clearProps: "opacity,transform" });
      }
    }, el);
    scrollToTarget(el.getBoundingClientRect().top + window.scrollY - 110);
    el.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const p = project;
  return (
    <div ref={ref} id="project-details" className="project-details-panel" tabIndex={-1} aria-label={`${p.title} case study`}>
      <div className="project-panel-toolbar" data-in>
        <span>{p.kind}</span>
        <button className="panel-close" onClick={onClose} aria-label="Close project details"><X size={16} /></button>
      </div>

      <div className="project-study">
        <aside className="case-study-overview">
          <div data-in>
            <h3 className="study-title">{p.title}</h3>
            <p className="project-category">{p.year} · {p.kind}</p>
          </div>
          <p data-in className="case-study-summary">{p.overview}</p>
          <dl data-in className="case-study-facts">
            {p.facts.map((f) => (<div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>))}
          </dl>
          {p.note && <p data-in className="case-study-note">{p.note}</p>}
          {(p.links.github || p.links.demo) && (
            <div data-in className="project-links">
              {p.links.github && <a className="text-link" href={p.links.github} target="_blank" rel="noreferrer">Source <span className="arrow"><ArrowUpRight size={12} /></span></a>}
              {p.links.demo && <a className="text-link" href={p.links.demo} target="_blank" rel="noreferrer">Live app <span className="arrow"><ArrowUpRight size={12} /></span></a>}
            </div>
          )}
          {p.images?.[0] && <div data-in className="case-study-shot"><img src={p.images[0]} alt={`${p.title} screenshot`} /></div>}
        </aside>

        <div className="case-study-narrative">
          <section data-in className="case-study-section">
            <h4>The brief</h4>
            <p>{p.brief}</p>
          </section>

          <section data-in className="case-study-section">
            <h4>My approach</h4>
            <ol className="case-study-delivery">
              {p.approach.map((a) => (
                <li key={a.title}><h5>{a.title}</h5><p>{a.text}</p></li>
              ))}
            </ol>
          </section>

          <section data-in className="case-study-section">
            <h4>Architecture</h4>
            <div className="arch-flow">
              {p.architecture.map((a, i) => (
                <span key={a} style={{ display: "contents" }}>
                  <span className="router-node"><span className="n">{i + 1}</span>{a}</span>
                  {i < p.architecture.length - 1 && <span className="link" aria-hidden>→</span>}
                </span>
              ))}
            </div>
          </section>

          <section data-in className="case-study-section">
            <h4>Built with</h4>
            <div className="mini-tags">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
          </section>

          {p.challenges?.length ? (
            <section data-in className="case-study-section"><h4>Challenges</h4><ol className="case-study-delivery">{p.challenges.map((c) => <li key={c}><p>{c}</p></li>)}</ol></section>
          ) : null}
          {p.outcomes?.length ? (
            <section data-in className="case-study-section"><h4>The impact</h4><ol className="case-study-delivery">{p.outcomes.map((c) => <li key={c}><p>{c}</p></li>)}</ol></section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
