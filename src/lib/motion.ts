import { gsap } from "@/lib/gsap";
import { CustomEase } from "gsap/CustomEase";

/**
 * Single source of truth for entrance motion across the site.
 * Subtle by design: a short rise with a fade, fast start and a long soft settle.
 */
export const MOTION = {
  /** cubic-bezier(0.22, 1, 0.36, 1) */
  ease: "reveal",
  bezier: "0.22,1,0.36,1",
  duration: 0.7,
  y: 16,
  stagger: 0.08,
  /** Longest total stagger for one batch, however many items enter together. */
  maxStagger: 0.6,
  /** Reveal once the element's top passes this fraction of the viewport height (~10–15% of it visible). */
  startAt: 0.9,
} as const;

let ready = false;
/** Registers the shared ease once (client only). */
export function ensureMotionEase() {
  if (ready || typeof window === "undefined") return;
  gsap.registerPlugin(CustomEase);
  CustomEase.create(MOTION.ease, MOTION.bezier);
  ready = true;
}
