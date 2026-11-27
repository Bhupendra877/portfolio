import { createElement, type ReactNode } from "react";
import { reveal } from "@/components/ui/Reveal";

type Props = {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  auto?: boolean; // join the site-wide scroll reveal; pass false when a parent drives its own entrance
  label?: string;
};

/** Multi-line heading. Each line keeps its own mask span; entrance comes from the shared reveal system. */
export default function AnimatedText({ lines, as = "h2", className, auto = true, label }: Props) {
  return createElement(
    as,
    { className, "aria-label": label, ...(auto ? reveal() : {}) },
    lines.map((l, i) => (
      <span key={i} className="mask-line" aria-hidden={label ? true : undefined}>
        <span data-line>{l}</span>
      </span>
    )),
  );
}
