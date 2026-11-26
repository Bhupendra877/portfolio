"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `placeholder` until the box is within `rootMargin` of the viewport, then renders `children`.
 * Keeps heavy below-the-fold UI (and its JavaScript) out of the initial page load.
 */
export default function LazyMount({ children, placeholder, rootMargin = "600px" }: { children: ReactNode; placeholder: ReactNode; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [show, rootMargin]);
  // a real box (not display:contents) so IntersectionObserver can see it; fills its grid/flex slot
  return <div ref={ref} style={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>{show ? children : placeholder}</div>;
}
