/** Central profile configuration. Source: resume + LinkedIn profile supplied by the owner. */
export const profile = {
  name: "Bhupendra Singh Sisodiya",
  displayName: "Bhupendra Singh",
  nameLines: ["Bhupendra", "Singh."], // About heading lines
  firstName: "Bhupendra", // giant footer watermark
  initials: "BS",
  designation: "Software Development Engineer & Full-Stack Developer",
  designationLines: ["Software Development Engineer", "& Full-Stack (MERN) Developer."],
  heroLabel: "MERN & FULL-STACK DEVELOPMENT",
  summary:
    "Computer Science graduate and Software Development Engineer building scalable, user-centric web applications with the MERN stack — RESTful APIs, authentication, database design and third-party integrations.",
  /** Short intro shown beside the portrait. Wrap words in ** ** to bold them. */
  lead: "I build **MERN-stack applications** and **REST APIs**, turning ideas into reliable products.",
  siteUrl: "https://example.com", // TODO: set to your deployed URL
  portrait: "/portraits/portrait-2.webp",
  portraitAlt: "Portrait of Bhupendra Singh, smiling in a black shirt with arms crossed",
  currentEmployment: {
    role: "Software Development Engineer",
    company: "Hotbit Infosoft",
    since: "July 2026",
  },
  email: "bhupendrasinghsisodiya47@gmail.com",
  location: "Indore, Madhya Pradesh, India",
  githubUrl: "https://github.com/Bhupendra877",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/bhupendra-singh-35a80b271", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/Bhupendra877", icon: "github" },
    { label: "Instagram", href: "https://instagram.com/bhupendra746_", icon: "instagram" },
  ],
  education: [
    { qualification: "B.Tech — Computer Science & Engineering", institution: "Medi-Caps University, Indore", range: "2022 — 2026", note: "CGPA 8.32" },
    { qualification: "Class XII (PCM)", institution: "MPBSE", range: "2022", note: "84.20%" },
    { qualification: "Class X", institution: "MPBSE", range: "2020", note: "93.66%" },
  ],
  highlights: [
    "Solved 250+ DSA problems on LeetCode and GeeksforGeeks (C++).",
    "Participated in the Medi-Caps University internal hackathon for Smart India Hackathon 2025.",
  ],
} as const;

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
