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
/** Whole-word match, so "hi" doesn't fire on "this" or "hiring". */
const word = (words: string[], ...w: string[]) => {
  const line = ` ${words.join(" ")} `;
  return w.some((x) => line.includes(` ${x} `));
};
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

const GREETINGS = ["hi", "hii", "hiii", "hello", "helo", "hey", "heyy", "yo", "hola", "namaste", "namaskar", "sup", "hlo", "good morning", "good afternoon", "good evening"];
const topics = "skills, projects, experience, education or how to get in touch";

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/** Common English and Hindi/Hinglish abuse, matched as whole words only (so "class" or "assistant" never trigger it). */
const BAD_WORDS = [
  "fuck", "fucking", "fucker", "fck", "fuk", "shit", "bitch", "bastard", "asshole", "ass", "dick", "cunt", "slut", "whore", "motherfucker", "mf", "wtf", "stfu",
  "chutiya", "chutiye", "chutia", "chu", "bc", "mc", "bsdk", "bhosdike", "bhosdi", "bhosda", "madarchod", "behenchod", "bhenchod", "benchod", "gandu", "gaand", "gand",
  "lauda", "lavda", "lawda", "lode", "lund", "randi", "harami", "haramkhor", "kutta", "kutte", "kamina", "kamine", "saala", "saale", "tatti", "jhatu", "betichod",
];
const isAbusive = (words: string[]) => words.some((w) => BAD_WORDS.includes(w));

/** Small talk: greetings, thanks, goodbyes and questions about the assistant itself. */
function smallTalk(q: string, words: string[]): string | null {
  const short = words.length <= 4;
  if (short && word(words, ...GREETINGS)) {
    return pick([
      `Hi there! 👋 I'm ${profile.firstName}'s assistant. Ask me about ${profile.firstName}'s ${topics}.`,
      `${timeGreeting()}! Welcome to ${profile.firstName}'s portfolio. What would you like to know: ${topics}?`,
      `Hey! Good to see you here. I can tell you about ${profile.firstName}'s ${topics}. Where shall we start?`,
    ]);
  }
  if (has(q, "how are you", "how r u", "how are u", "how's it going", "hows it going", "kaise ho", "kya haal", "kaisa hai", "whats up", "what's up", "wassup")) {
    return pick([
      `Doing great, thanks for asking! 😊 How can I help you get to know ${profile.firstName}'s work?`,
      `All good here, and happy you stopped by. Want a quick look at ${profile.firstName}'s projects or skills?`,
    ]);
  }
  if (word(words, "thanks", "thank", "thx", "ty", "shukriya", "dhanyawad", "dhanyavad")) {
    return pick([
      "You're welcome! Anything else you'd like to know?",
      `Happy to help! If you'd like to reach ${profile.firstName} directly, just ask how to get in touch.`,
      "Anytime! 🙌",
    ]);
  }
  if (word(words, "bye", "goodbye", "cya", "tata", "alvida") || has(q, "see you", "good night")) {
    return pick([
      `Bye! Thanks for visiting ${profile.firstName}'s portfolio. 👋`,
      `Take care! ${profile.firstName}'s inbox is always open: ${profile.email}`,
    ]);
  }
  if (short && word(words, "ok", "okay", "cool", "nice", "great", "awesome", "wow", "good", "amazing", "perfect", "hmm")) {
    return pick(["Glad you think so! 😄 Want to see the projects next?", `Great! Ask me anything else about ${profile.firstName}.`]);
  }
  if (word(words, "who are you", "your name", "are you a bot", "are you ai", "are you real", "tum kaun", "aap kaun") || (short && word(words, "what are you"))) {
    return `I'm ${profile.firstName}'s portfolio assistant. I answer from what's on this site: ${topics}.`;
  }
  if (word(words, "help", "menu", "options") || has(q, "what can you do", "what can i ask")) {
    return `You can ask me things like:\n• What are your skills?\n• Show me your projects\n• Where have you worked?\n• What did you study?\n• How can I get in touch?`;
  }
  return null;
}

function localAnswer(raw: string): string {
  const q = raw.toLowerCase().trim();
  const words = q.match(/[a-z']+/g) ?? [];
  if (isAbusive(words)) return "jana la*de";
  const chat = smallTalk(q, words);
  if (chat) return chat;
  // "hi, what are your skills?" -> greet, then answer
  const hello = word(words.slice(0, 2), ...GREETINGS) ? "Hi! " : "";

  if (has(q, "where", "location", "based", "city", "live")) {
    return `${hello}${profile.firstName} is based in ${profile.location}.`;
  }
  if (has(q, "current", "currently", "right now", "nowadays", "present")) {
    const c = profile.currentEmployment;
    return `${hello}${profile.firstName} is currently a ${c.role} at ${c.company} (since ${c.since}).`;
  }
  if (has(q, "resume", "cv")) {
    return `${hello}There's no résumé download on this site, but you can request one at ${profile.email}.`;
  }
  if (has(q, "available", "availability", "open to", "freelance", "hiring", "opportunit")) {
    return `${hello}For roles, freelance work or collaborations, the best way is to email ${profile.email} or use the contact form on this page.`;
  }
  if (has(q, "skill", "stack", "tech", "tool", "language", "know")) {
    return hello + skillGroups.map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n");
  }
  if (has(q, "project", "built", "build", "portfolio", "work on")) {
    const hit = projects.find((p) => q.includes(p.title.toLowerCase()) || q.includes(p.id));
    if (hit) return `${hello}${hit.title} — ${hit.tagline} Stack: ${hit.stack.join(", ")}. Open its folder on the page for the full case study.`;
    return `${hello}Featured projects: ${projects.map((p) => p.title).join(", ")}. Ask about any of them by name.`;
  }
  if (has(q, "experience", "job", "career", "worked", "work history", "employ", "role", "company")) {
    return hello + milestones.filter((m) => m.type === "work").map((m) => `${m.range}: ${m.title} at ${m.org}`).join("\n");
  }
  if (has(q, "educat", "study", "degree", "universit", "school", "qualif", "cgpa", "marks")) {
    return hello + profile.education.map((e) => `${e.range}: ${e.qualification}, ${e.institution} (${e.note})`).join("\n");
  }
  if (has(q, "achiev", "dsa", "leetcode", "hackathon", "certif")) {
    return hello + profile.highlights.join("\n");
  }
  if (has(q, "contact", "email", "reach", "touch", "hire", "linkedin", "github", "instagram")) {
    return `${hello}Email: ${profile.email}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.socials[0].href}\nOr use the contact form further down the page.`;
  }
  if (has(q, "who", "about", "yourself", "intro", "tell me")) {
    return `${hello}${profile.name} is a ${profile.designation}. ${profile.summary}`;
  }
  return pick([
    `Hmm, I'm not sure about that one. I can only answer from this portfolio: ${topics}.`,
    `I don't have that on this site, sorry! Try asking about ${profile.firstName}'s ${topics}.`,
  ]);
}

export async function askAssistant(question: string, _history: ChatMessage[] = []): Promise<string> {
  await new Promise((r) => setTimeout(r, 650 + Math.random() * 550)); // "thinking" time before the reply streams in; swap for a network call later
  return localAnswer(question);
}
