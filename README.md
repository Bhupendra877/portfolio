# Portfolio — Next.js (App Router)

Editorial developer portfolio, light cream theme (dark toggle) set in Space Grotesk: pill header + slide-in menu,
per-letter hero, a portrait that flips in 3D from the hero into the About column on scroll, staggered Tech Stack,
glass project folders with an inline case-study panel, a draw-on career road, mailto contact form,
an illustrated crowd footer with cursor repulsion, and a local "Ask AI" assistant.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · lucide-react

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Replace the content (no component edits needed)

| What | File |
|---|---|
| Name, designation, summary, email, socials, current job | `src/data/profile.ts` |
| Skill groups and tags | `src/data/skills.ts` |
| Projects / case studies | `src/data/projects.ts` |
| Career timeline (work + education) | `src/data/experience.ts` |

Everything marked `[PLACEHOLDER]` is demo text — nothing in it is real. The AI assistant answers only from these files.

## Assets to replace

- `public/portraits/portrait.svg` — placeholder portrait. Use a grayscale WebP/AVIF and update `profile.portrait`.
- Project screenshots — folders/modal use generated mockups (`components/illustrations/ProjectPreview.tsx`); swap for real images.
- Crowd characters — procedural SVGs: `components/illustrations/Character.tsx`, composition in `crowd.ts`.
- Social image: add an OG image to `metadata` in `src/app/layout.tsx`.

## Assistant / LLM backend

`src/services/assistant.ts` is a local rule-based responder. To use a real model, replace `askAssistant` with a `fetch` to
your own route (e.g. `src/app/api/chat/route.ts`) that holds the API key server-side. Never ship keys to the browser.

## Notes

- Reduced-motion users get static content and native scrolling. Crowd animation pauses off-screen.
- The contact form has no backend: it validates, then opens a prefilled `mailto:` draft.
- Deploy anywhere Next.js runs (Vercel: import the repo, no config needed). Set `siteUrl` in `profile.ts` first.
