"use client";
import { useRef, createElement, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";

type Props = {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  auto?: boolean; // animate on scroll; hero sets false and drives its own timeline
  label?: string;
};

/** Masked line-by-line reveal. Each line slides up from behind its own mask. */
export default function AnimatedText({ lines, as = "h2", className, auto = true, label }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAPAnimation(ref, () => {
    if (!auto) return;
    gsap.from(ref.current!.querySelectorAll("[data-line]"), {
      yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out",
      scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
    });
  });
  return createElement(
    as,
    { ref, className, "aria-label": label },
    lines.map((l, i) => (
      <span key={i} className="mask-line" aria-hidden={label ? true : undefined}>
        <span data-line>{l}</span>
      </span>
    )),
  );
}
