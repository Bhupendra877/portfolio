"use client";
import { useEffect } from "react";

/** Calls `cb` with pointer position normalised to -0.5…0.5 relative to the window. */
export function useMousePosition(cb: (nx: number, ny: number) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const h = (e: PointerEvent) => cb(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    window.addEventListener("pointermove", h, { passive: true });
    return () => window.removeEventListener("pointermove", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
