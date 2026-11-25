"use client";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import FloatingNav from "./FloatingNav";
import AIAssistant from "@/components/interactive/AIAssistant";

export default function Providers({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <FloatingNav />
      {children}
      <AIAssistant />
      <div className="sc-grain" aria-hidden />
    </>
  );
}
