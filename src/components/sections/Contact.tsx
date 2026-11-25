"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { profile } from "@/data/profile";
import AnimatedText from "@/components/ui/AnimatedText";
import { socialIcon } from "@/components/ui/Icons";

type Errors = Partial<Record<"name" | "email" | "topic", string>>;

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  useGSAPAnimation(root, () => {
    gsap.from(root.current!.querySelectorAll("[data-in]"), { y: 28, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
  });

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) ?? "").trim();
    const er: Errors = {};
    if (v("name").length < 2) er.name = "Please tell me what to call you.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) er.email = "Please enter a valid email address.";
    if (v("topic").length < 10) er.topic = "Add a little more detail so I can help.";
    setErrors(er); setDone(false);
    if (Object.keys(er).length) { e.currentTarget.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(); return; }
    // No backend: open the visitor's mail client with a prefilled draft.
    const subject = `Hello from ${v("name")}`;
    const body = `${v("topic")}\n\n— ${v("name")} (${v("email")})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  const err = (k: keyof Errors) => errors[k] && <p id={`${k}-err`} role="alert" className="field-error">{errors[k]}</p>;

  return (
    <section id="contact" ref={root} className="contact-section wrap">
      <div className="contact-layout">
        <div className="contact-opening">
          <AnimatedText lines={["Let’s talk."]} className="" as="h2" />
          <p data-in>Whether it&apos;s a full-time role or a freelance project, my inbox is open.</p>
          <div className="contact-details" data-in>
            <div className="contact-email-row">
              <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={16} /></a>
              <button className="copy-btn" onClick={copy} aria-label="Copy email address">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
              <span role="status" className="sr-only" style={{ position: "absolute", left: -9999 }}>{copied ? "Email address copied" : ""}</span>
            </div>
            <div className="contact-socials">
              {profile.socials.map((s) => { const I = socialIcon[s.icon as keyof typeof socialIcon]; return <a key={s.label} href={s.href} target="_blank" rel="noreferrer"><I size={16} />{s.label}</a>; })}
            </div>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="contact-form" aria-label="Contact form" data-in>
          <div className="contact-field">
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" autoComplete="name" placeholder="What should I call you?" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
            {err("name")}
          </div>
          <div className="contact-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
            {err("email")}
          </div>
          <div className="contact-field contact-message">
            <label htmlFor="topic">What do you have in mind?</label>
            <textarea id="topic" name="topic" placeholder="A little about your opportunity or project..." aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-err" : undefined} />
            {err("topic")}
          </div>
          <div className="contact-submit">
            <button type="submit" className="btn btn-solid">Create email draft <ArrowUpRight size={16} /></button>
            <p className="contact-note" role="status">{done ? "Opening your email app with a prefilled draft…" : "Nothing is sent from this page; it prepares a draft in your email app."}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
