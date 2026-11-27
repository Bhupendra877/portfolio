import { createElement, type ElementType, type HTMLAttributes, type ReactNode } from "react";

/**
 * Declarative hooks into the site-wide reveal system (see hooks/useRevealSystem).
 * They only add data attributes, so they render identical markup on the server and the client and
 * never change layout. Prefer spreading the helpers onto existing elements over adding wrappers.
 */

/** Mark an element to fade/rise in on scroll. `delay` (s) offsets it, e.g. for the second column of a pair. */
export const reveal = (delay?: number) => ({ "data-reveal": "", ...(delay ? { "data-reveal-delay": String(delay) } : {}) });

/** Mark a container whose direct children reveal one after another (grids, lists, form fields). */
export const revealChildren = (delay?: number) => ({ "data-reveal-children": "", ...(delay ? { "data-reveal-delay": String(delay) } : {}) });

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType; delay?: number; children?: ReactNode };

/** <Reveal as="p">…</Reveal>: an element that reveals itself. */
export function Reveal({ as = "div", delay, ...rest }: Props) {
  return createElement(as, { ...reveal(delay), ...rest });
}

/** <StaggerContainer as="ul">…</StaggerContainer>: children reveal in sequence. */
export function StaggerContainer({ as = "div", delay, ...rest }: Props) {
  return createElement(as, { ...revealChildren(delay), ...rest });
}

export default Reveal;
