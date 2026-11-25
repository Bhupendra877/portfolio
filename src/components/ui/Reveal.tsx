"use client";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";

type Props = { children: ReactNode; className?: string; delay?: number; y?: number; stagger?: number; children_selector?: string };

/** Fades/slides content up when it enters the viewport. */
export default function Reveal({ children, className, delay = 0, y = 40, stagger = 0.1, children_selector }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAPAnimation(ref, () => {
    const targets = children_selector ? ref.current!.querySelectorAll(children_selector) : ref.current;
    gsap.from(targets, {
      y, opacity: 0, duration: 1, delay, stagger, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
    });
  });
  return <div ref={ref} className={className}>{children}</div>;
}
