"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { milestones } from "@/data/experience";
import { MOTION, ensureMotionEase } from "@/lib/motion";

/**
 * Career "road": five stops on an alternating high/low rhythm joined by a dotted base path and an ink path
 * that draws itself (stroke-dashoffset). Marker centres are measured from the DOM so the curve always
 * passes through the real markers at any width.
 */
export default function TimelineGraph() {
  const root = useRef<HTMLDivElement>(null);
  const [d, setD] = useState("");
  const [ext, setExt] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = root.current!;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const pts = Array.from(el.querySelectorAll<HTMLElement>(".journey-stop-marker")).map((m) => {
        const r = m.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
      });
      if (pts.length < 2 || window.innerWidth <= 900) { setExt(""); return setD(""); }
      let path = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], dx = (b.x - a.x) / 2;
        path += ` C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
      }
      // the road keeps going past the last stop (dotted only): "more to come"
      const last = pts[pts.length - 1], endX = base.width, endY = last.y - 46, dx = (endX - last.x) / 2;
      setExt(`M${last.x} ${last.y} C${last.x + dx} ${last.y} ${endX - dx} ${endY} ${endX} ${endY}`);
      setSize({ w: base.width, h: base.height });
      setD(path);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  useGSAPAnimation(root, () => {
    const el = root.current!;
    ensureMotionEase();
    gsap.set(el.querySelectorAll(".journey-stop-content > *"), { opacity: 0, y: MOTION.y });
    gsap.set(el.querySelectorAll(".journey-stop-marker"), { scale: 0 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 85%", once: true, onEnter: () => el.setAttribute("data-drawn", "true") },
    });
    el.querySelectorAll<HTMLElement>(".journey-stop").forEach((s, i) => {
      // markers settle (no overshoot), then each stop's copy follows, stop by stop
      tl.to(s.querySelector(".journey-stop-marker"), { scale: 1, duration: 0.5, ease: MOTION.ease }, 0.1 + i * 0.2)
        .to(s.querySelectorAll(".journey-stop-content > *"), { opacity: 1, y: 0, duration: MOTION.duration, stagger: 0.06, ease: MOTION.ease }, 0.18 + i * 0.2);
    });
  }, []);

  return (
    <div ref={root} className="journey-roadmap" data-drawn="false" data-count={milestones.length}>
      {d && (
        <svg className="journey-road" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden>
          <path className="journey-road-base" d={d} />
          {ext && <path className="journey-road-base journey-road-ext" d={ext} />}
          <path className="journey-road-ink" d={d} pathLength={1} />
        </svg>
      )}
      {milestones.map((m) => (
        <article key={m.id} className={`journey-stop ${m.current ? "journey-now" : ""}`}>
          <div className="journey-stop-marker"><span /></div>
          <div className="journey-stop-content">
            <p className="journey-date">{m.current && <span className="journey-current">Current role</span>}{m.range}</p>
            <h3>{m.title}</h3>
            <p className="journey-place">{m.org}{m.location && <span>{m.location}</span>}</p>
            {m.description && <p className="journey-description">{m.description}</p>}
            {m.highlights && <ul className="journey-highlights">{m.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
            {m.stack && <div className="mini-tags">{m.stack.map((t) => <span key={t}>{t}</span>)}</div>}
          </div>
        </article>
      ))}
    </div>
  );
}
