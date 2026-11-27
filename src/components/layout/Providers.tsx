"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useRevealSystem } from "@/hooks/useRevealSystem";
import FloatingNav from "./FloatingNav";
// The assistant is not needed for first paint: load it once the browser is idle.
const AIAssistant = dynamic(() => import("@/components/interactive/AIAssistant"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  useRevealSystem();
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
    else setTimeout(() => setIdle(true), 1200);
  }, []);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <FloatingNav />
      {children}
      {idle && <AIAssistant />}
      <div className="sc-grain" aria-hidden />
    </>
  );
}
