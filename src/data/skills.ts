export type Skill = { name: string; note: string; tone: "dark" | "light" };
export type SkillGroup = { id: string; title: string; description: string; skills: Skill[] };

const s = (name: string, note: string, tone: "dark" | "light"): Skill => ({ name, note, tone });

/** Source: resume + LinkedIn. */
export const skillGroups: SkillGroup[] = [
  {
    id: "front",
    title: "Languages & Frontend",
    description: "Responsive, component-driven interfaces.",
    skills: [
      s("JavaScript", "ES6+", "light"), s("C++", "DSA problem solving", "dark"), s("HTML5", "Semantic markup", "dark"),
      s("CSS3", "Layouts & styling", "light"), s("React.js", "Component-driven UIs", "dark"), s("Redux Toolkit", "State management", "light"),
      s("Tailwind CSS", "Utility-first styling", "light"), s("Axios", "Async data fetching", "dark"),
    ],
  },
  {
    id: "back",
    title: "Backend & Databases",
    description: "APIs, auth and data persistence.",
    skills: [
      s("Node.js", "Server-side JavaScript", "dark"), s("Express.js", "REST API framework", "light"), s("REST APIs", "Design & integration", "light"),
      s("JWT Auth", "Token-based authentication", "dark"), s("RBAC", "Role-based access control", "light"), s("Middleware", "Express middleware", "dark"),
      s("MongoDB", "NoSQL database", "light"), s("SQL", "Relational databases", "dark"),
    ],
  },
  {
    id: "tools",
    title: "Tools, Cloud & Fundamentals",
    description: "How the work is built, shipped and reasoned about.",
    skills: [
      s("Git", "Version control", "light"), s("GitHub", "Collaboration", "dark"), s("Postman", "API testing", "dark"),
      s("Cloudinary", "Media storage & CDN", "light"), s("AWS", "S3 & EC2 exposure", "dark"), s("DSA", "250+ problems solved", "light"),
      s("OOP", "Object-oriented design", "dark"), s("MVC", "Architecture pattern", "light"), s("Agile / Scrum", "Sprints & stand-ups", "dark"),
    ],
  },
];
