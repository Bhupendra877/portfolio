"use client";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { scrollToTarget } from "@/lib/scroll";
import dynamic from "next/dynamic";
import LazyMount from "@/components/ui/LazyMount";

// The illustrated crowd is heavy (dozens of SVGs + animation timelines): load it only near the footer.
const AnimatedCrowd = dynamic(() => import("@/components/interactive/AnimatedCrowd"), {
  ssr: false,
  loading: () => <div className="footer-crowd-scene" aria-hidden />,
});

const explore = [
  { id: "about", label: "About" }, { id: "skills", label: "Skills" }, { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" }, { id: "contact", label: "Contact" },
];

export default function Footer() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (id === "about" && window.innerWidth >= 1024) {
      scrollToTarget(el.getBoundingClientRect().top + window.scrollY + el.offsetHeight - window.innerHeight);
    } else scrollToTarget(`#${id}`);
  };
  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="wrap footer-top">
        <div className="footer-identity">
          <h2>{profile.displayName}.</h2>
          <p>{profile.designationLines[0]} &amp;<br />Full-Stack Developer.</p>
        </div>
        <nav aria-label="Footer">
          <p>Explore</p>
          <div>
            {explore.map((l) => <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a>)}
          </div>
        </nav>
        <div className="footer-contact">
          <p>Get in touch</p>
          <a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={14} /></a>
          <span>© {new Date().getFullYear()} {profile.name}.</span>
        </div>
      </div>

      <div className="wrap footer-finale" style={{ width: "100%", maxWidth: "none", paddingInline: 0 }}>
        <div className="wrap footer-finale-heading">
          <p>See you around.</p>
          <button onClick={() => scrollToTarget(0)}>Back to top <ArrowUp size={14} /></button>
        </div>
        <LazyMount placeholder={<div className="footer-crowd-scene" aria-hidden />}><AnimatedCrowd /></LazyMount>
        <div className="wrap footer-scene-bottom"><small>Designed and built by {profile.displayName}.</small></div>
      </div>
    </footer>
  );
}
