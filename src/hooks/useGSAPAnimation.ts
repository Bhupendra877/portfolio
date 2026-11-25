"use client";
import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Runs `fn` inside a gsap.context scoped to `scope`; everything (tweens,
 * ScrollTriggers, listeners registered via the returned cleanup) is reverted
 * on unmount. Skipped entirely under prefers-reduced-motion so content stays visible.
 */
export function useGSAPAnimation(
  scope: RefObject<HTMLElement | null>,
  fn: () => void | (() => void),
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (prefersReducedMotion() || !scope.current) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => { cleanup = fn(); }, scope);
    return () => { if (typeof cleanup === "function") cleanup(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
