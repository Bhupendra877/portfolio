"use client";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { useMousePosition } from "@/hooks/useMousePosition";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { scrollToTarget } from "@/lib/scroll";
import { WebDecor, HangingSpider } from "@/components/ui/WebDecor";
import { MOTION, ensureMotionEase } from "@/lib/motion";
import { reveal } from "@/components/ui/Reveal";

/** Faint "source code" backdrop assembled from the real profile data. */
const codeCols = (() => {
  const p = profile;
  const stack = skillGroups.map((g) => `    ${g.id}: [${g.skills.slice(0, 4).map((k) => `"${k.name}"`).join(", ")}],`);
  return [
    [
      "const developer = {", `  name: "${p.name}",`, `  role: "${p.designation}",`, `  location: "${p.location}",`, "  current: {", `    company: "${p.currentEmployment.company}",`,
      `    since: "${p.currentEmployment.since}",`, "  },", "  education: [", ...p.education.slice(0, 1).map((e) => `    { degree: "${e.qualification}", gpa: "${e.note}" },`), "  ],",
      "  projects: [", ...projects.map((x) => `    "${x.title}",`), "  ],", "};", "", "export default function Portfolio() {", "  return <Hero {...developer} />;", "}",
    ],
    [
      "const stack = {", ...stack, "};", "", "async function build(idea: Idea) {", "  const plan = await think(idea);", "  return compile(plan).then(deploy);", "}", "",
      "app.use(authenticate);", "app.use('/api', router);", "", "<footer>", "  <p>See you around.</p>", "</footer>", 'git commit -m "ship it"', "git push origin main",
    ],
    [
      "interface Experience {", "  company: string;", "  role: string;", "  current?: boolean;", "}", "", "const experience: Experience[] = [",
      `  { company: "${p.currentEmployment.company}", role: "${p.currentEmployment.role}", current: true },`, '  { company: "JBHUNT Technologies", role: "MERN Stack Intern" },', "];", "",
      "useEffect(() => {", "  sync(state);", "}, [state]);", "", "docker compose up --build -d",
    ],
  ];
})();

const Letters = ({ text }: { text: string }) => (
  <>{text.split("").map((c, i) => <span key={i} className="hero-letter-window"><span className="hero-letter">{c}</span></span>)}</>
);

const OpenMark = () => (
  <svg viewBox="0 0 44 64" aria-hidden>
    <path d="M38 4 L6 32 L38 60" transform="translate(3 3)" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="8" />
    <path d="M38 4 L6 32 L38 60" fill="none" stroke="currentColor" strokeWidth="8" />
  </svg>
);
const CloseMark = () => (
  <svg viewBox="0 0 72 64" aria-hidden>
    <g transform="translate(3 3)" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="8"><path d="M26 60 L40 4" /><path d="M46 4 L68 32 L46 60" /></g>
    <g fill="none" stroke="currentColor" strokeWidth="8"><path d="M26 60 L40 4" /><path d="M46 4 L68 32 L46 60" /></g>
  </svg>
);

const SRCSET = "/portraits/portrait-2-480.webp 480w, /portraits/portrait-2-760.webp 760w, /portraits/portrait-2-1018.webp 1018w";
/** Responsive portrait: the browser picks the smallest file that is sharp enough for the slot. */
const Img = ({ priority = false }: { priority?: boolean }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/portraits/portrait-2-760.webp"
    alt={profile.portraitAlt} width={1018} height={1280} decoding="async"
    loading={priority ? "eager" : "lazy"}
  />
);

/** Renders **bold** segments. */
const Rich = ({ text }: { text: string }) => (
  <>{text.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : <span key={i}>{t}</span>))}</>
);

export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const code = useRef<HTMLDivElement>(null);
  const cx = useRef<((v: number) => void) | null>(null);
  const cy = useRef<((v: number) => void) | null>(null);

  useGSAPAnimation(root, () => {
    const el = root.current!;
    const one = <T extends HTMLElement>(s: string) => el.querySelector<T>(s)!;
    const all = (s: string) => el.querySelectorAll<HTMLElement>(s);

    // Hero entrance on load: letters rise out of their windows, then the portrait, metadata and code settle in.
    ensureMotionEase();
    const intro = gsap.timeline({ delay: 0.1 });
    intro
      .from(all(".hero-letter"), { yPercent: 105, rotationX: -80, duration: 1.1, ease: "power4.out", stagger: { each: 0.035, from: "start" } })
      .from(all(".hero-code-mark"), { opacity: 0, scale: 0.85, duration: MOTION.duration, ease: MOTION.ease }, 0.6)
      .from(all(".hero-portrait-link img, .portrait-face-front img"), { opacity: 0, duration: 0.9, ease: MOTION.ease }, 0.45)
      .from(all("[data-meta]"), { y: MOTION.y, opacity: 0, duration: MOTION.duration, stagger: MOTION.stagger, ease: MOTION.ease }, 0.7)
      .from(code.current, { opacity: 0, duration: 1.4, ease: "power2.out" }, 0.2);

    cx.current = gsap.quickTo(code.current, "x", { duration: 1.2, ease: "power3.out" });
    cy.current = gsap.quickTo(code.current, "y", { duration: 1.2, ease: "power3.out" });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      el.classList.add("portrait-motion-ready");
      const card = one(".portrait-card");
      const heroSlot = one(".hero-portrait-link");
      const slot = one(".bio-portrait");

      // offset of a node inside the section, immune to transforms and scroll
      const rect = (n: HTMLElement) => {
        let x = 0, y = 0, e: HTMLElement | null = n;
        while (e && e !== el) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null; }
        return { x, y, w: n.offsetWidth, h: n.offsetHeight };
      };
      // where the About slot sits in viewport coordinates once the sticky stage releases
      const target = () => { const t = rect(slot); return { ...t, y: t.y - (el.offsetHeight - window.innerHeight) }; };

      gsap.set(card, { width: () => slot.offsetWidth, height: () => slot.offsetHeight, transformPerspective: 1300, transformOrigin: "50% 50%" });
      const faces = card.querySelectorAll<HTMLElement>(".portrait-face");
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.fromTo(
        card,
        {
          x: () => { const h = rect(heroSlot), t = target(); return h.x + h.w / 2 - t.w / 2; },
          y: () => { const h = rect(heroSlot), t = target(); return h.y + h.h / 2 - t.h / 2; },
          scale: () => rect(heroSlot).w / target().w,
          rotationY: 0,
        },
        { x: () => target().x, y: () => target().y, scale: 1, rotationY: -180, duration: 1 },
        0,
      ).fromTo(faces, { borderRadius: 14 }, { borderRadius: 16, duration: 1, ease: "none" }, 0)
        // colour floods in as the portrait settles into the About column (reverses on scroll-up)
        .fromTo(card.querySelectorAll("img"), { filter: "grayscale(1)" }, { filter: "grayscale(0)", duration: 0.3, ease: "power1.out" }, 0.7);
      return () => el.classList.remove("portrait-motion-ready");
    });

    // About copy reveals through the shared system (data-reveal); the right column trails the left slightly
    // phones/tablets (no flying card): colour the About portrait as it scrolls into view
    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(one(".bio-portrait img"), { filter: "grayscale(1)" }, { filter: "grayscale(0)", ease: "none", scrollTrigger: { trigger: one(".bio-portrait"), start: "top 85%", end: "top 40%", scrub: true } });
    });
    return () => mm.revert();
  }, [], { immediate: true });

  useMousePosition((nx, ny) => { cx.current?.(nx * -24); cy.current?.(ny * -14); });


  return (
    <section id="home" ref={root} className="about-section">
      <div className="hero">
        <WebDecor className="web-tl" />
        <WebDecor className="web-br" />
        <HangingSpider />
        <div ref={code} className="hero-code-background" aria-hidden>
          {codeCols.map((lines, i) => (
            <pre key={i} style={{ left: `${[2, 36, 70][i]}vw`, top: `${[2, 9, 5][i]}%`, opacity: [0.17, 0.12, 0.15][i] }}>{lines.join("\n")}</pre>
          ))}
        </div>

        <div className="hero-heading-composition">
          <h1 className="hero-display-title" aria-label="Software Engineer">
            <span className="title-line" aria-hidden><span className="hero-word"><span className="hero-code-mark hero-code-open"><OpenMark /></span><Letters text="SOFTWARE" /></span></span>
            <span className="title-line" aria-hidden><span className="hero-word"><Letters text="ENGINEER" /><span className="hero-code-mark hero-code-close"><CloseMark /></span></span></span>
          </h1>
        </div>

        <a
          className="hero-portrait-link" href="#about" aria-label="About me"
          onClick={(e) => { e.preventDefault(); scrollToTarget(document.getElementById("about")!.getBoundingClientRect().top + window.scrollY); }}
        >
          <Img priority />
        </a>

        <div className="hero-footer wrap">
          <p data-meta className="hero-year" suppressHydrationWarning>©{new Date().getFullYear()}</p>
          <p data-meta className="hero-focus">{`{{ /${profile.heroLabel} `}<span className="caret" aria-hidden />{` }}`}</p>
        </div>
      </div>

      <div id="about" className="about-stage">
        <div className="wrap bio-grid">
          <div className="bio-introduction">
            <h2 {...reveal()}>Hi, I&apos;m<br />{profile.nameLines[0]}<br />{profile.nameLines[1]}</h2>
            <p {...reveal()} className="bio-role"><span>{profile.designationLines[0]}</span><span>{profile.designationLines[1]}</span></p>
            <div {...reveal()} className="bio-current">
              <span>Currently at</span>
              <p><strong>{profile.currentEmployment.company}</strong><br />{profile.currentEmployment.role}<br /><span>{profile.location.split(",").slice(0, 2).join(",")}</span></p>
            </div>
          </div>
          <figure className="bio-portrait"><Img priority /></figure>
          <div className="bio-description">
            <p {...reveal(0.12)} className="bio-lead"><Rich text={profile.lead} /></p>
            <div {...reveal(0.12)} className="bio-actions">
              <a className="btn btn-solid" href="#projects" onClick={(e) => { e.preventDefault(); scrollToTarget("#projects"); }}>Explore projects <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* One portrait card travels from the hero to the About column, flipping in 3D. */}
      <div className="portrait-journey" aria-hidden>
        <div className="portrait-sticky-stage">
          <div className="portrait-card">
            <div className="portrait-face portrait-face-front"><Img /></div>
            <div className="portrait-face portrait-face-back"><Img /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
