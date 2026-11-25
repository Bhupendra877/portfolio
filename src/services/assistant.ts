import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { milestones } from "@/data/experience";
import { skillGroups } from "@/data/skills";

/**
 * Local, rule-based portfolio assistant that only answers from structured data.
 * To use a real LLM: replace `askAssistant` with a fetch to your own server route
 * (e.g. app/api/chat/route.ts) that holds the API key. NEVER put keys in frontend code.
 */
export type ChatMessage = { role: "user" | "assistant"; text: string };

export const welcome = {
  title: `Get to know ${profile.firstName}’s work.`,
  placeholder: `Ask about ${profile.firstName}…`,
  suggestions: ["What are your skills?", "Show me your projects", "Where have you worked?", "How can I get in touch?"],
};

const has = (q: string, ...w: string[]) => w.some((x) => q.includes(x));

function localAnswer(raw: string): string {
  const q = raw.toLowerCase();
  if (has(q, "skill", "stack", "tech", "tool", "language", "know")) {
    return skillGroups.map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n");
  }
  if (has(q, "project", "built", "build", "portfolio", "work on")) {
    const hit = projects.find((p) => q.includes(p.title.toLowerCase()) || q.includes(p.id));
    if (hit) return `${hit.title} — ${hit.tagline} Stack: ${hit.stack.join(", ")}. Open its folder on the page for the full case study.`;
    return `Featured projects: ${projects.map((p) => p.title).join(", ")}. Ask about any of them by name.`;
  }
  if (has(q, "experience", "job", "career", "worked", "work history", "employ", "role", "company")) {
    return milestones.filter((m) => m.type === "work").map((m) => `${m.range}: ${m.title} at ${m.org}`).join("\n");
  }
  if (has(q, "educat", "study", "degree", "universit", "school", "qualif", "cgpa", "marks")) {
    return profile.education.map((e) => `${e.range}: ${e.qualification}, ${e.institution} (${e.note})`).join("\n");
  }
  if (has(q, "achiev", "dsa", "leetcode", "hackathon", "certif")) {
    return profile.highlights.join("\n");
  }
  if (has(q, "contact", "email", "reach", "touch", "hire", "linkedin", "github", "instagram")) {
    return `Email: ${profile.email}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.socials[0].href}\nOr use the contact form further down the page.`;
  }
  if (has(q, "who", "about", "yourself", "intro", "hello", "hi ", "hey")) {
    return `${profile.name} is a ${profile.designation}. ${profile.summary}`;
  }
  return "I can only answer from what's on this portfolio: skills, projects, experience, education and contact details. Try one of those.";
}

export async function askAssistant(question: string, _history: ChatMessage[] = []): Promise<string> {
  await new Promise((r) => setTimeout(r, 450)); // natural pacing; swap for a network call later
  return localAnswer(question);
}
