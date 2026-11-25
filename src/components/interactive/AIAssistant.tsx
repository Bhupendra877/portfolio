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

  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);

  const send = async (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    setText("");
    const next: ChatMessage[] = [...msgs, { role: "user", text: t }];
    setMsgs(next);
    setBusy(true);
    const a = await askAssistant(t, next);
    setMsgs([...next, { role: "assistant", text: a }]);
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

        <div ref={list} className="chat-messages" aria-live="polite">
          {msgs.length === 0 && (
            <div className="chat-welcome">
              <h3>{welcome.title}</h3>
              <div className="chat-chips">{welcome.suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`chat-message ${m.role === "user" ? "is-user" : ""}`}>
              {m.role === "user" ? <div className="chat-user">{m.text}</div> : <div className="chat-assistant"><span className="chat-speaker">{profile.firstName}&apos;s Assistant</span>{m.text}</div>}
            </div>
          ))}
          {busy && <p className="chat-thinking">Thinking…</p>}
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
