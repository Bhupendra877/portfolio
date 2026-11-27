"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { askAssistant, welcome, type ChatMessage } from "@/services/assistant";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const first = useRef(true);
  /** Tokens of the latest assistant reply and how many are revealed (fake streaming); `shown` is null when idle. */
  const [tokens, setTokens] = useState<string[]>([]);
  const [shown, setShown] = useState<number | null>(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    gsap.set(panel.current, { autoAlpha: 0, y: 28, scale: 0.97, transformOrigin: "100% 100%" });
    gsap.set(backdrop.current, { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (open) {
      gsap.to(backdrop.current, { autoAlpha: 1, duration: 0.35 });
      gsap.to(panel.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power4.out", onComplete: () => input.current?.focus() });
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    gsap.to(backdrop.current, { autoAlpha: 0, duration: 0.3 });
    gsap.to(panel.current, { autoAlpha: 0, y: 40, scale: 0.96, duration: 0.35, ease: "power3.in" });
    trigger.current?.focus();
  }, [open]);

  // Keep the newest text in view: glide (not jump) whenever the content grows taller.
  const lastH = useRef(0);
  useEffect(() => {
    const el = list.current;
    if (!el || el.scrollHeight === lastH.current) return;
    lastH.current = el.scrollHeight;
    gsap.to(el, { scrollTop: el.scrollHeight - el.clientHeight, duration: 0.6, ease: "power2.out", overwrite: true });
  }, [msgs, busy, shown]);

  /** Reveal a reply word by word at a steady, time-based pace (frame-rate independent), easing in at the start. */
  const stream = (full: string) =>
    new Promise<void>((done) => {
      const toks = full.match(/\s+|[^\s]+/g) ?? [];
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !toks.length) { setShown(null); return done(); }
      const ends: number[] = []; let acc = 0;
      for (const t of toks) ends.push(acc += t.length);
      const RATE = 85; // characters per second
      setTokens(toks); setShown(0);
      const t0 = performance.now();
      const frame = (now: number) => {
        const sec = (now - t0) / 1000;
        const chars = RATE * (sec < 0.4 ? sec * sec / 0.8 : sec - 0.2); // gentle ramp-up for the first 0.4s
        let n = 0; while (n < toks.length && ends[n] <= chars) n++;
        setShown((cur) => (cur === n ? cur : n));
        if (n >= toks.length) { setShown(null); return done(); }
        raf.current = requestAnimationFrame(frame);
      };
      raf.current = requestAnimationFrame(frame);
    });

  const send = async (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    setText("");
    const next: ChatMessage[] = [...msgs, { role: "user", text: t }];
    setMsgs(next);
    setBusy(true);
    const a = await askAssistant(t, next);
    setShown(0);
    setMsgs([...next, { role: "assistant", text: a }]);
    await stream(a);
    setBusy(false);
  };

  return (
    <>
      <div ref={backdrop} onClick={() => setOpen(false)} className="chat-backdrop" aria-hidden />
      <button ref={trigger} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className="chat-fab" style={open ? { opacity: 0, pointerEvents: "none" } : undefined}>
        <MessageCircle size={16} /> <span>Ask AI</span>
      </button>

      <div ref={panel} role="dialog" aria-label={`${profile.displayName}'s assistant`} inert={!open} data-lenis-prevent className="chat-panel">
        <header className="chat-toolbar">
          <div className="chat-toolbar-title">
            <div className="chat-avatar">{profile.firstName[0]}.</div>
            <div><h2>{profile.firstName}&apos;s Assistant</h2><p>Projects, skills &amp; experience</p></div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close assistant" className="chat-close"><X size={18} /></button>
        </header>

        <div ref={list} className="chat-messages" aria-live="polite" aria-busy={shown !== null}>
          {msgs.length === 0 && (
            <div className="chat-welcome">
              <h3>{welcome.title}</h3>
              <div className="chat-chips">{welcome.suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => {
            const live = shown !== null && i === msgs.length - 1 && m.role === "assistant";
            return (
              <div key={i} className={`chat-message ${m.role === "user" ? "is-user" : ""}`}>
                {m.role === "user" ? <div className="chat-user">{m.text}</div> : (
                  <div className="chat-assistant">
                    <span className="chat-speaker">{profile.firstName}&apos;s Assistant</span>
                    {live ? tokens.slice(0, shown!).map((t, k) => (/^\s+$/.test(t) ? t : <span key={k} className="chat-token">{t}</span>)) : m.text}
                    {live && <span className="chat-stream-caret" aria-hidden />}
                  </div>
                )}
              </div>
            );
          })}
          {busy && shown === null && <p className="chat-thinking">Thinking<span className="chat-dots" aria-hidden><i /><i /><i /></span></p>}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="chat-form">
          <div className="chat-input-row">
            <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder={welcome.placeholder} aria-label="Message" className="chat-input" />
            <button type="submit" disabled={!text.trim() || busy} aria-label="Send message" className="chat-send"><Send size={16} /></button>
          </div>
          <p className="chat-input-note">Answers come from the content of this portfolio.</p>
        </form>
      </div>
    </>
  );
}
