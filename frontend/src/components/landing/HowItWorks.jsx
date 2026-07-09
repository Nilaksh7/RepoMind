import { FolderGit2, Database, MessageSquareText } from "lucide-react";

const steps = [
  {
    icon: FolderGit2,
    step: "01",
    title: "Import Repository",
    description:
      "Paste the URL of any public GitHub repository. RepoMind clones the repository and prepares it for analysis.",
  },
  {
    icon: Database,
    step: "02",
    title: "Index Repository",
    description:
      "The repository is processed, indexed, and organized to enable fast semantic search and intelligent code understanding.",
  },
  {
    icon: MessageSquareText,
    step: "03",
    title: "Explore & Ask Questions",
    description:
      "Browse files, inspect repository insights, search code semantically, and ask questions about the codebase in natural language.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white">How RepoMind Works</h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            From importing a repository to understanding an unfamiliar codebase
            in just three simple steps.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.step}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600">
                    <Icon size={28} className="text-white" />
                  </div>

                  <span className="text-4xl font-bold text-slate-700">
                    {step.step}
                  </span>
                </div>

                <h3 className="mb-4 text-2xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="leading-7 text-slate-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
