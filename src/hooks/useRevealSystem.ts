"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION, ensureMotionEase } from "@/lib/motion";
import { prefersReducedMotion } from "./useReducedMotion";

const SELECTOR = "[data-reveal], [data-reveal-children] > *";

/** Extra delay (seconds) from the element's own `data-reveal-delay`, or its stagger container's. */
const delayOf = (el: Element) => {
  const own = (el as HTMLElement).dataset.revealDelay;
  const parent = el.parentElement?.hasAttribute("data-reveal-children") ? el.parentElement.dataset.revealDelay : undefined;
  return parseFloat(own ?? parent ?? "0") || 0;
};

/**
 * Site-wide scroll reveal. Mount once (in Providers). Every element marked with `data-reveal`, and every
 * direct child of a `data-reveal-children` container, fades in and rises MOTION.y px the first time it
 * enters the viewport. Elements entering together are batched and staggered in DOM order, so a section
 * reads label -> heading -> copy -> content -> actions without per-section code.
 *
 * - One ScrollTrigger batch (no scroll listeners of our own, no React state, no re-renders).
 * - Elements already on screen or scrolled past at setup are left untouched: nothing flashes on load,
 *   and content is fully visible without JavaScript (SSR-safe).
 * - Inline transform/opacity are cleared after each reveal, so hover effects and fixed overlays are unaffected.
 * - Skipped entirely under prefers-reduced-motion.
 */
export function useRevealSystem() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    ensureMotionEase();
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const limit = window.innerHeight * MOTION.startAt;
        const items = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
          (el) => el.getClientRects().length > 0 && el.getBoundingClientRect().top >= limit,
        );
        if (!items.length) return;
        // transition:none while revealing so CSS hover transitions don't smear the tween
        gsap.set(items, { opacity: 0, y: MOTION.y, transition: "none" });
        ScrollTrigger.batch(items, {
          // top of the element at MOTION.startAt of the viewport; content at the very end of the page (which can
          // never scroll that far up) fires just before max scroll instead of never
          start: (self: ScrollTrigger) => {
            const top = (self.trigger as HTMLElement).getBoundingClientRect().top + window.scrollY;
            return Math.min(top - window.innerHeight * MOTION.startAt, ScrollTrigger.maxScroll(window) - 2);
          },
          once: true,
          interval: 0.08,
          onEnter: (batch) => {
            // big batches (chip grids) share a capped stagger budget so the last item isn't left waiting
            const step = Math.min(MOTION.stagger, MOTION.maxStagger / Math.max(1, batch.length - 1));
            gsap.to(batch, {
              opacity: 1, y: 0, duration: MOTION.duration, ease: MOTION.ease, overwrite: true,
              stagger: (i: number, el: Element) => i * step + delayOf(el),
              clearProps: "transform,opacity,transition",
            });
          },
        });
      });
    };

    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1200 });
    else setTimeout(run, 150);
    return () => { cancelled = true; ctx?.revert(); };
  }, []);
}
