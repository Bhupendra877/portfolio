"use client";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Ellipsis, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { scrollToTarget, lockScroll } from "@/lib/scroll";
import { socialIcon } from "@/components/ui/Icons";

const primary = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
const secondary = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
];

/** Scroll to a section; "about" lands where the portrait journey has finished. */
function goTo(id: string) {
  if (id === "home") return scrollToTarget(0);
  const el = document.getElementById(id);
  if (!el) return;
  if (id === "about" && window.innerWidth >= 1024) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    return scrollToTarget(Math.max(0, top + el.offsetHeight - window.innerHeight));
  }
  scrollToTarget(`#${id}`);
}

export default function FloatingNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);

  useEffect(() => { setDark(document.documentElement.dataset.theme === "dark"); }, []);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* ignore */ }
    setDark(!dark);
  };

  const show = () => { closing.current = false; setMounted(true); setOpen(true); };
  const hide = (after?: () => void) => {
    if (closing.current) return;
    closing.current = true;
    const p = panel.current, o = overlay.current;
    gsap.to(p, { opacity: 0, y: -18, scale: 0.97, duration: 0.35, ease: "power3.in" });
    gsap.to(o, { opacity: 0, duration: 0.35, onComplete: () => { setOpen(false); setMounted(false); after?.(); trigger.current?.focus(); } });
  };

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const p = panel.current!;
    gsap.set(p, { transformOrigin: "100% 0%" });
    gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(p, { opacity: 0, y: -24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" });
    gsap.fromTo(p.querySelectorAll("[data-wave]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07, delay: 0.15, ease: "power4.out" });
    gsap.fromTo(p.querySelectorAll("[data-fade]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.4, ease: "power3.out" });
    p.querySelector<HTMLElement>("[data-close]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
      if (e.key === "Tab") {
        const f = p.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); lockScroll(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const nav = (id: string) => hide(() => setTimeout(() => goTo(id), 30));

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a href="#main" onClick={(e) => { e.preventDefault(); goTo("home"); }} className="brand" aria-label={`${profile.displayName} — back to top`}>{profile.firstName}</a>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button ref={trigger} className="nav-menu-trigger" onClick={show} aria-haspopup="dialog" aria-expanded={open} aria-label="Open menu"><Ellipsis size={20} /></button>
          </div>
        </div>
      </header>

      {mounted && (
        <div ref={overlay} className="nav-overlay" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
          <div ref={panel} className="nav-dialog" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="nav-panel">
              <div className="nav-panel-top">
                <button data-close className="nav-panel-close" onClick={() => hide()}>
                  close <span className="nav-close-circle"><X size={22} /></span>
                </button>
              </div>
              <nav className="nav-panel-links" aria-label="Primary">
                <div className="nav-menu-primary">
                  {primary.map((l) => (
                    <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); nav(l.id); }}><span className="wave-window"><span data-wave className="wave-text">{l.label}</span></span></a>
                  ))}
                </div>
                <div className="nav-menu-secondary">
                  {secondary.map((l) => <a data-fade key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); nav(l.id); }}>{l.label}</a>)}
                </div>
              </nav>
              <div className="nav-panel-footer" data-fade>
                <a className="nav-panel-email" href={`mailto:${profile.email}`}>{profile.email}</a>
                <div className="nav-panel-socials">
                  {profile.socials.map((s) => { const I = socialIcon[s.icon as keyof typeof socialIcon]; return <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}><I size={20} /></a>; })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
