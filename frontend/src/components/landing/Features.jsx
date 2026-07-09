import {
  Bot,
  Search,
  FolderTree,
  BarChart3,
  Zap,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Repository Chat",
    description:
      "Ask questions about any repository and receive contextual answers grounded in the indexed codebase.",
  },
  {
    icon: Search,
    title: "Semantic Code Search",
    description:
      "Search repositories using meaning instead of exact keywords to quickly find relevant code.",
  },
  {
    icon: FolderTree,
    title: "Repository Explorer",
    description:
      "Navigate project structure, inspect files, and understand code organization with ease.",
  },
  {
    icon: BarChart3,
    title: "Repository Insights",
    description:
      "View repository statistics including languages, file distribution, and project size.",
  },
  {
    icon: Zap,
    title: "Fast Indexing",
    description:
      "Clone, process, and index repositories efficiently for an optimized developer experience.",
  },
  {
    icon: RefreshCw,
    title: "Automatic Refresh",
    description:
      "Detect repository updates and keep indexed data synchronized with the latest commits.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Everything You Need to Understand a Repository
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            RepoMind combines AI-powered repository analysis, semantic search,
            repository insights, and intelligent navigation into a single,
            developer-focused workspace.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10">
                  <Icon size={28} className="text-blue-400" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
