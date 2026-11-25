export type Project = {
  id: string;
  title: string;
  tagline: string;
  year: string; // short label shown on the folder
  overview: string;
  problem?: string;
  solution?: string;
  architecture: string[];
  stack: string[];
  features: string[];
  challenges?: string[];
  outcomes?: string[];
  links: { github?: string; demo?: string };
  /** Shown in the panel toolbar, e.g. "Professional case study" or "Personal project". */
  kind: string;
  /** One-sentence goal shown under "The brief". */
  brief: string;
  /** Short facts table (Role / Ownership / Stack / ...). */
  facts: { label: string; value: string }[];
  /** Numbered "My approach" steps. */
  approach: { title: string; text: string }[];
  /** Small italic-style note under the facts (e.g. confidentiality). */
  note?: string;
  variant: 0 | 1 | 2 | 3; // generated preview mockup (until real screenshots are added)
  /** Real screenshots (paths under /public). When provided they replace the generated mockups. */
  images?: string[];
};

/** Source: resume + LinkedIn. Add repo/demo links and screenshots when available. */
export const projects: Project[] = [
  {
    id: "learnedge",
    title: "LearnEdge",
    tagline: "Full-stack EdTech platform.",
    year: "Personal project",
    overview: "A role-based EdTech platform for students and instructors with secure JWT/OTP authentication and course enrollment workflows.",
    kind: "Personal project",
    brief: "Build a role-based EdTech platform that serves both students and instructors, with secure sign-in and course enrollment.",
    facts: [
      { label: "Role", value: "Full-stack developer" },
      { label: "Ownership", value: "Frontend, APIs and media delivery" },
      { label: "Stack", value: "MERN · Redux Toolkit · JWT · Tailwind CSS" },
      { label: "Media", value: "Cloudinary CDN" },
    ],
    approach: [
      { title: "Secure access", text: "Built JWT/OTP authentication with separate Student and Instructor roles and course enrollment workflows." },
      { title: "Design the APIs", text: "Designed 10+ RESTful APIs in Node.js and Express.js to manage user profiles and course content." },
      { title: "Shape the experience", text: "Used Redux Toolkit for a persistent cart, a multi-step course builder and real-time video progress tracking." },
      { title: "Deliver media at scale", text: "Integrated the Cloudinary CDN for scalable media storage and optimized content delivery." },
    ],
    architecture: ["React.js + Redux Toolkit", "Node.js / Express.js REST APIs", "MongoDB", "Cloudinary CDN"],
    stack: ["MERN", "Redux Toolkit", "JWT", "Tailwind CSS", "Cloudinary"],
    features: [
      "Role-based access for Student and Instructor",
      "Secure JWT/OTP authentication and course enrollment workflows",
      "10+ RESTful APIs managing user profiles and course content",
      "Redux Toolkit for persistent cart, multi-step course builder and real-time video progress tracking",
      "Cloudinary CDN for scalable media storage and optimized delivery",
    ],
    links: { github: "https://github.com/Bhupendra877" },
    variant: 0,
  },
  {
    id: "petbuddy",
    title: "PetBuddy",
    tagline: "Pet adoption & fostering platform.",
    year: "Personal project",
    overview: "A full-stack adoption platform connecting Admins, Donors and Adopters through an approval workflow.",
    kind: "Personal project",
    brief: "Connect Admins, Donors and Adopters on one adoption and fostering platform, with an approval workflow between them.",
    facts: [
      { label: "Role", value: "Full-stack developer" },
      { label: "Ownership", value: "Architecture, APIs and frontend" },
      { label: "Stack", value: "MERN · Axios · JWT · RBAC" },
    ],
    approach: [
      { title: "Model the workflow", text: "Architected the platform around Admin, Donor and Adopter roles with an approval workflow." },
      { title: "Build the APIs", text: "Built 15+ REST APIs with Node.js and Express.js for dynamic pet listings, real-time status updates and input validation." },
      { title: "Secure every role", text: "Implemented JWT authentication and a 3-tier RBAC model so each role only sees and changes what it should." },
      { title: "Polish the frontend", text: "Designed a responsive React.js frontend with Axios-based async fetching, loading states and custom modal error handling." },
    ],
    architecture: ["React.js + Axios", "Node.js / Express.js REST APIs", "JWT + RBAC", "MongoDB"],
    stack: ["MERN", "Axios", "JWT", "RBAC"],
    features: [
      "15+ REST APIs for dynamic pet listings, real-time status updates and input validation",
      "JWT authentication with 3-tier role-based access control",
      "Responsive React frontend with Axios-based async fetching and loading states",
      "Custom modal error handling",
    ],
    links: { github: "https://github.com/Bhupendra877" },
    variant: 2,
  },
  {
    id: "elearning-client",
    title: "E-Learning Client Project",
    tagline: "Live EdTech product at JBHUNT Technologies.",
    year: "Internship · 2026",
    overview: "Backend and API-integration work on a live e-learning client application during my MERN Stack internship.",
    kind: "Professional case study",
    brief: "Contribute backend and API-integration work to a live e-learning client application, as part of an Agile team.",
    facts: [
      { label: "Role", value: "MERN Stack Intern" },
      { label: "Ownership", value: "Backend modules and API integration" },
      { label: "Stack", value: "Node.js · Express.js · MongoDB · SQL" },
      { label: "Cloud", value: "AWS (S3 and EC2 exposure)" },
    ],
    approach: [
      { title: "Build backend modules", text: "Developed and maintained backend modules with Node.js and Express.js, exposing RESTful APIs consumed by the React.js frontend." },
      { title: "Model the data", text: "Designed schemas and wrote optimized queries across SQL and MongoDB for course content and user records." },
      { title: "Integrate services", text: "Integrated third-party APIs, including payment gateways and notification services, with robust error handling." },
      { title: "Ship with the team", text: "Worked in an Agile environment (sprint planning, code reviews, daily stand-ups) and gained practical exposure to AWS S3 and EC2 for media storage and deployment." },
    ],
    note: "An account of my internship work at JBHUNT Technologies. Client-specific details are not included.",
    architecture: ["React.js frontend", "Node.js / Express.js REST APIs", "SQL + MongoDB", "Third-party APIs"],
    stack: ["Node.js", "Express.js", "MongoDB", "SQL", "REST APIs", "AWS"],
    features: [
      "Developed and maintained backend modules with RESTful APIs consumed by the React frontend",
      "Designed schemas and optimized queries across SQL and MongoDB for course content and user records",
      "Integrated third-party APIs (payment gateways, notification services) with robust error handling",
      "Practical exposure to AWS S3 and EC2 for media storage and deployment",
      "Worked in an Agile team: sprint planning, code reviews and daily stand-ups",
    ],
    links: {},
    variant: 1,
  },
];
