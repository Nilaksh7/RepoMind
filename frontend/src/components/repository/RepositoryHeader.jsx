import { useEffect, useState } from "react";
import { BookOpen, Sparkles, GitBranch } from "lucide-react";

import { openRepository } from "../../services/repository.service";

import Card from "../ui/Card";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

import RepositoryReadmeModal from "./RepositoryReadmeModal";
import AISummaryModal from "./AISummaryModal";
import DependencyGraphModal from "./DependencyGraphModal";

export default function RepositoryHeader({ repositoryId }) {
  const [repository, setRepository] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  useEffect(() => {
    loadRepository();
  }, [repositoryId]);

  async function loadRepository() {
    try {
      setIsLoading(true);
      setError("");

      const response = await openRepository(repositoryId);

      setRepository(response.repository);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load repository.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Card>
        <LoadingState message="Loading repository..." />
      </Card>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const aiReady = repository.aiIndexStatus === "completed";

  const aiStatus = {
    pending: {
      label: "Preparing AI",
      className: "bg-yellow-600/10 text-yellow-400",
    },
    indexing: {
      label: "Indexing AI",
      className: "bg-blue-600/10 text-blue-400",
    },
    completed: {
      label: "AI Ready",
      className: "bg-emerald-600/10 text-emerald-400",
    },
    failed: {
      label: "AI Failed",
      className: "bg-red-600/10 text-red-400",
    },
  }[repository.aiIndexStatus] || {
    label: repository.aiIndexStatus,
    className: "bg-slate-700 text-slate-300",
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                {repository.name}
              </h1>

              <a
                href={repository.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-sm text-blue-400 transition hover:text-blue-300 hover:underline"
              >
                {repository.githubUrl}
              </a>
            </div>

            {repository.technologies?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {repository.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-400 ring-1 ring-blue-500/20"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
              {repository.defaultBranch}
            </span>

            <span
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${aiStatus.className}`}
            >
              {aiStatus.label}
            </span>

            <button
              onClick={() => setIsReadmeOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white"
            >
              <BookOpen size={16} />
              README
            </button>

            <button
              disabled={!aiReady}
              title={
                aiReady
                  ? ""
                  : "AI features will be available after repository indexing finishes."
              }
              onClick={() => setIsSummaryOpen(true)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                aiReady
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
                  : "cursor-not-allowed bg-slate-700 text-slate-500"
              }`}
            >
              <Sparkles size={16} />
              AI Summary
            </button>

            <button
              disabled={!aiReady}
              title={
                aiReady
                  ? ""
                  : "Dependency graph will be available after repository indexing finishes."
              }
              onClick={() => setIsGraphOpen(true)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ${
                aiReady
                  ? "border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-slate-800 hover:text-white"
                  : "cursor-not-allowed border-slate-700 text-slate-500"
              }`}
            >
              <GitBranch size={16} />
              Graph
            </button>
          </div>
        </div>
      </Card>

      <RepositoryReadmeModal
        repositoryId={repositoryId}
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
      />

      <AISummaryModal
        repositoryId={repositoryId}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />

      <DependencyGraphModal
        repositoryId={repositoryId}
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
      />
    </>
  );
}
