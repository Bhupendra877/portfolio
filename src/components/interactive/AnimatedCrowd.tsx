"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { profile } from "@/data/profile";
import Character from "@/components/illustrations/Character";
import SpiderSuit from "@/components/illustrations/SpiderSuit";
import { placements, CROWD_ASSETS } from "@/components/illustrations/crowd";

const rand = gsap.utils.random;
const order = { back: 0, mid: 1, hero: 2, front: 3 } as const;

export default function AnimatedCrowd() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scene.current!;
    const set = () => el.style.setProperty("--scene-h", `${el.clientHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAPAnimation(scene, () => {
    const el = scene.current!;
    const stage = el.querySelector<HTMLElement>(".crowd-stage")!;
    const idle: gsap.core.Timeline[] = [];

    type C = { el: HTMLElement; depth: number; hero: boolean; cx: number; cy: number; x: (v: number) => void; y: (v: number) => void; r: (v: number) => void };
    const chars: C[] = Array.from(el.querySelectorAll<HTMLElement>("[data-char]")).map((c) => {
      const depth = Number(c.dataset.depth);
      const drift = c.querySelector<HTMLElement>("[data-drift]")!;
      const bob = c.querySelector<HTMLElement>("[data-bob]")!;
      // idle life: slow drift (inner wrapper), bob + tiny rotation (innermost) — independent of cursor movement on the outer wrapper
      const tl = gsap.timeline({ paused: true });
      tl.to(drift, { x: rand(-1, 1) * (30 + depth * 60), duration: rand(10, 20), ease: "sine.inOut", yoyo: true, repeat: -1 }, 0);
      tl.to(bob, { y: -(3 + depth * 6), rotation: rand(-1.6, 1.6), duration: rand(2.6, 5), ease: "sine.inOut", yoyo: true, repeat: -1, delay: rand(0, 2) }, 0);
      if (c.dataset.peek === "1") tl.to(drift, { yPercent: 50, autoAlpha: 0, duration: 2.2, ease: "power2.inOut", yoyo: true, repeat: -1, repeatDelay: rand(6, 10), delay: rand(1, 6) }, 0);
      idle.push(tl);
      return {
        el: c, depth, hero: c.dataset.hero === "1", cx: 0, cy: 0,
        x: gsap.quickTo(c, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(c, "y", { duration: 1.1, ease: "power3.out" }),
        r: gsap.quickTo(c, "rotation", { duration: 1.3, ease: "power3.out" }),
      };
    });

    // layout centres (offset* ignores transforms, so they stay the "home" positions)
    const measure = () => chars.forEach((c) => { c.cx = c.el.offsetLeft + c.el.offsetWidth / 2; c.cy = c.el.offsetTop + c.el.offsetHeight / 2; });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    const wm = el.querySelector<HTMLElement>("[data-watermark]")!;
    const wmx = gsap.quickTo(wm, "x", { duration: 1.4, ease: "power3.out" });

    const repel = (clientX: number, clientY: number) => {
      const r = stage.getBoundingClientRect();
      const px = clientX - r.left, py = clientY - r.top;
      const R = r.width * 0.24;
      chars.forEach((c) => {
        const dx = c.cx - px, dy = c.cy - py;
        const d = Math.hypot(dx, dy) || 1;
        if (d >= R) { c.x(0); c.y(0); c.r(0); return; }
        const f = Math.pow(1 - d / R, 1.5);
        const k = c.hero ? 0.18 : 1; // the featured avatar mostly stays; the crowd parts around it
        const mag = f * (70 + c.depth * 190) * k;
        c.x((dx / d) * mag);
        c.y((dy / d) * mag * 0.3);
        c.r((dx / d) * f * 5 * c.depth * k);
      });
      wmx((px / r.width - 0.5) * -12);
    };
    const release = () => { chars.forEach((c) => { c.x(0); c.y(0); c.r(0); }); wmx(0); };

    let touchTimer: number | undefined;
    const onMove = (e: PointerEvent) => repel(e.clientX, e.clientY);
    const onDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") { repel(e.clientX, e.clientY); window.clearTimeout(touchTimer); touchTimer = window.setTimeout(release, 1100); } };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerleave", release);

    const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => idle.forEach((t) => (s.isActive ? t.play() : t.pause())) });

    return () => {
      el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerdown", onDown); el.removeEventListener("pointerleave", release);
      window.clearTimeout(touchTimer); ro.disconnect(); st.kill(); idle.forEach((t) => t.kill());
    };
  });

  const wmSize = `min(370px, ${Math.min(22.7, 100 / (profile.firstName.length * 0.64)).toFixed(1)}vw)`;
  return (
    <div ref={scene} className="footer-crowd-scene [touch-action:pan-y]" aria-hidden="true">
      <div data-watermark className="footer-crowd-name" style={{ fontSize: wmSize }}>{profile.firstName.toUpperCase()}.</div>
      <div className="crowd-stage">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="2.4" /></filter>
        </svg>
        {placements.slice().sort((a, b) => order[a.row] - order[b.row]).map((p) => {
          const src = CROWD_ASSETS[p.id];
          return (
            <div key={p.id} data-char data-depth={p.depth} data-hero={p.row === "hero" ? 1 : 0} data-peek={p.peek ? 1 : 0} className="crowd-char"
              style={p.row === "hero"
                // the avatar is also capped by the scene height (0.35 × height ≈ 94% tall), and stays centred
                ? { left: "50%", bottom: `${p.bottom}%`, width: `min(${p.width}%, calc(var(--scene-h, 9999px) * .35))`, marginLeft: `calc(min(${p.width}%, calc(var(--scene-h, 9999px) * .35)) / -2)` }
                : { left: `${p.left}%`, bottom: `${p.bottom}%`, width: `${p.width}%` }}>
              <div data-drift>
                <div data-bob style={src ? undefined : { filter: "url(#ink)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {src ? <>
                    <img src={src} alt="" loading="lazy" decoding="async" width={311} height={834} draggable={false} />
                  </> : p.suit ? <SpiderSuit suit={p.suit} full={p.spec.full} /> : <Character spec={p.spec} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
