import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRepositories } from "../../services/repository.service";

export default function RepositoryGrid({ refreshKey }) {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadRepositories();
  }, [refreshKey]);

  async function loadRepositories() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getRepositories();

      setRepositories(response.repositories);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load repositories.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="mt-8 text-slate-400">Loading repositories...</div>;
  }

  if (error) {
    return (
      <div className="mt-8 rounded-xl border border-red-800 bg-red-950/30 p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-10 py-20 text-center">
        <h3 className="text-xl font-semibold text-white">
          No repositories yet
        </h3>

        <p className="mt-3 text-slate-400">
          Import your first GitHub repository to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {repositories.map((repository) => (
          <div
            key={repository.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h3 className="text-xl font-semibold text-white">
              {repository.name}
            </h3>

            <p className="mt-2 break-all text-sm text-slate-400">
              {repository.githubUrl}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400">
                {repository.status}
              </span>

              <button
                onClick={() => navigate(`/repository/${repository.id}`)}
                className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
              >
                Open →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
