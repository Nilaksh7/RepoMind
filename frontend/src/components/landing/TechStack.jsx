const technologies = [
  "React",
  "Node.js",
  "Express.js",
  "FastAPI",
  "PostgreSQL",
  "pgvector",
  "Google Gemini",
  "JWT",
  "Google OAuth",
  "Git",
  "GitHub",
  "Docker",
];

export default function TechStack() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-bold text-white">
          Built with Modern Technologies
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-400">
          RepoMind is built using a modern full-stack architecture designed for
          scalable repository analysis, semantic search, and AI-powered code
          understanding.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 font-medium text-slate-300 transition duration-300 hover:border-blue-500 hover:text-blue-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
