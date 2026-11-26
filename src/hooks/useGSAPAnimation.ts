"use client";
import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "./useReducedMotion";

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };

/**
 * Runs `fn` inside a gsap.context scoped to `scope`; everything (tweens, ScrollTriggers, listeners
 * registered via the returned cleanup) is reverted on unmount. Skipped under prefers-reduced-motion.
 *
 * By default setup waits until the browser is idle, so below-the-fold sections don't measure layout
 * during the first load (this is what keeps Total Blocking Time low). Pass `immediate` for above-the-fold UI.
 */
export function useGSAPAnimation(
  scope: RefObject<HTMLElement | null>,
  fn: () => void | (() => void),
  deps: unknown[] = [],
  { immediate = false }: { immediate?: boolean } = {},
) {
  useEffect(() => {
    if (prefersReducedMotion() || !scope.current) return;
    let cleanup: void | (() => void);
    let ctx: gsap.Context | null = null;
    const run = () => { if (scope.current) ctx = gsap.context(() => { cleanup = fn(); }, scope); };

    const w = window as IdleWindow;
    let idleId: number | undefined, timer: number | undefined;
    if (immediate) run();
    else if (w.requestIdleCallback) idleId = w.requestIdleCallback(run, { timeout: 2000 });
    else timer = window.setTimeout(run, 200);

    return () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timer !== undefined) clearTimeout(timer);
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
