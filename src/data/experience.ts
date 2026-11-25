export type Milestone = {
  id: string;
  type: "work" | "education";
  range: string;
  title: string;
  org: string;
  location?: string;
  description?: string;
  /** Short bullet points (from the resume). */
  highlights?: string[];
  /** Technologies used in the role. */
  stack?: string[];
  current?: boolean;
};

/** Oldest first (left to right), ending with the current role. Source: resume + LinkedIn. Education lives in `profile.education`. */
export const milestones: Milestone[] = [
  { id: "jbhunt", type: "work", range: "January — March 2026", title: "MERN Stack Intern", org: "JBHUNT Technologies Pvt. Ltd.", location: "Indore, Madhya Pradesh",
    description: "Worked on a live e-learning client project, building backend modules and REST APIs with Node.js, Express.js, MongoDB and SQL." },
  {
    id: "hotbit", type: "work", range: "July 2026 — Present", title: "Software Development Engineer", org: "Hotbit Infosoft", location: "Indore, Madhya Pradesh",
    description: "Working as a Software Development Engineer, building web applications in the MERN stack.", current: true,
  },
];
