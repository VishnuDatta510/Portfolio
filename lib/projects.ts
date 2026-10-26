export type Project = {
  slug: string;
  name: string;
  year: string;
  tags: string[];
  summary: string;
  description?: string;
  stack?: string[];
  /** Architecture as columns of nodes, read left to right. */
  arch?: string[][];
  github: string;
  live: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "audira",
    name: "Audira AI",
    year: "2026",
    tags: ["AI", "Full-stack"],
    summary:
      "AI technical interviewer that runs coding, project and fundamentals rounds against your résumé, with code sandboxed on Judge0 in 13 languages.",
    description:
      "An AI technical interviewer that reads each candidate's résumé against the job description, then runs coding, project and fundamentals rounds, probing vague answers like a human interviewer. LLM-written problems are verified against a hidden reference solution and submissions run sandboxed on Judge0 in 13 languages, with recruiter reports that tie every score to the candidate's own words.",
    stack: ["LLMs", "Judge0", "13 languages", "Recruiter reports"],
    arch: [
      ["Résumé × job description"],
      ["AI interviewer", "Problem writer + verifier"],
      ["Judge0 sandbox", "Recruiter report"],
    ],
    github: "https://github.com/VishnuDatta510/Audira",
    live: "https://audira-ai.vercel.app/",
  },
  {
    slug: "coderep",
    name: "CodeRep",
    year: "2026",
    tags: ["Full-stack", "Tools"],
    summary:
      "Next.js app & Chrome Extension bringing spaced repetition to LeetCode, used by 20+ daily active users.",
    description:
      "A spaced-repetition system for LeetCode: a Next.js web app plus Chrome Extension used by 20+ daily active users, catching accepted submissions with 99% accuracy and scheduling reviews with an adaptive algorithm on PostgreSQL and Prisma.",
    stack: ["Next.js", "Chrome Extension", "PostgreSQL", "Prisma"],
    arch: [
      ["Chrome extension"],
      ["Next.js app", "Adaptive scheduler"],
      ["PostgreSQL · Prisma"],
    ],
    github: "https://github.com/VishnuDatta510/CodeRep",
    live: "https://coderep.vercel.app/",
  },
  {
    slug: "tasklane",
    name: "TaskLane",
    year: "2026",
    tags: ["Full-stack", "Backend"],
    summary:
      "Multi-tenant Jira-style tracker with role-based access, audit logs, Redis-cached analytics and Celery background jobs.",
    description:
      "A multi-tenant, Jira-style work tracker with drag-and-drop boards, server-enforced roles and an append-only audit log. The analytics dashboard stays at a constant 4 SQL queries at any data size, with Redis caching and Celery handling email and overdue sweeps off the request path.",
    stack: ["Multi-tenant", "RBAC", "Redis", "Celery"],
    arch: [
      ["Drag-and-drop boards"],
      ["API + role checks", "Append-only audit log"],
      ["SQL analytics", "Redis cache", "Celery jobs"],
    ],
    github: "https://github.com/VishnuDatta510/Tasklane",
    live: "",
  },
  {
    slug: "algoclash",
    name: "AlgoClash",
    year: "2026",
    tags: ["Real-time", "Full-stack"],
    summary:
      "Real-time 1v1 competitive coding arena featuring live execution and dynamic Elo ranking.",
    github: "https://github.com/VishnuDatta510/AlgoClash",
    live: "",
  },
  {
    slug: "fluensee",
    name: "FluenSee",
    year: "2025",
    tags: ["AI", "Real-time"],
    summary:
      "AI-powered language tutor with real-time video calls, peer-to-peer chat, and interactive flashcards.",
    description:
      "An AI-powered language learning platform on the MERN stack with real-time video calls, peer-to-peer chat and conversational AI sessions with integrated flashcards, powered by the Google Gemini API and Stream SDK.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Gemini API", "Stream SDK"],
    arch: [
      ["React client"],
      ["Express API", "Stream video + chat"],
      ["MongoDB", "Gemini API"],
    ],
    github: "https://github.com/VishnuDatta510/FluenSee",
    live: "https://fluensee.onrender.com/",
  },
  {
    slug: "whisperwall",
    name: "WhisperWall",
    year: "2026",
    tags: ["Real-time", "Backend"],
    summary:
      "Secure, real-time anonymous note-sharing board featuring distributed rate limiting via Redis.",
    github: "https://github.com/VishnuDatta510/WishperWall",
    live: "https://wishper-wall.vercel.app/",
  },
  {
    slug: "primesignal",
    name: "PrimeSignal",
    year: "2025",
    tags: ["Backend"],
    summary:
      "Scalable crypto trading REST API featuring role-based access control and Redis caching.",
    github: "https://github.com/VishnuDatta510/primesignal",
    live: "",
  },
  {
    slug: "telugu-spellchecker",
    name: "Telugu Spell Checker",
    year: "2025",
    tags: ["AI"],
    summary:
      "Intelligent NLP spell checker for Telugu providing semantic-based ranked correction candidates.",
    github: "https://github.com/VishnuDatta510/Telugu-SpellChecker",
    live: "",
  },
];

export const FEATURED = PROJECTS.filter((p) => p.arch);
