import { useEffect, useState } from "react";
import { Files, FolderTree, HardDrive, FileCode2 } from "lucide-react";

import { getRepositoryStatistics } from "../../services/repository.service";

function formatBytes(bytes = 0) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
}

function formatNumber(value = 0) {
  return value.toLocaleString();
}

export default function RepositoryStatistics({ repositoryId }) {
  const [statistics, setStatistics] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [largestFiles, setLargestFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStatistics();
  }, [repositoryId]);

  async function loadStatistics() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getRepositoryStatistics(repositoryId);

      setStatistics(response.statistics);
      setLanguages(response.languages);
      setLargestFiles(response.largestFiles);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load repository statistics.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">Loading repository statistics...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 rounded-2xl border border-red-900 bg-red-950/30 p-6">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold text-white">Repository Statistics</h2>

      <p className="mt-2 text-sm text-slate-400">
        Quick overview of the imported repository.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          icon={<Files size={22} />}
          title="Files"
          value={formatNumber(statistics.totalFiles)}
        />

        <StatisticCard
          icon={<FolderTree size={22} />}
          title="Directories"
          value={formatNumber(statistics.totalDirectories)}
        />

        <StatisticCard
          icon={<HardDrive size={22} />}
          title="Repository Size"
          value={formatBytes(statistics.totalSizeBytes)}
        />

        <StatisticCard
          icon={<FileCode2 size={22} />}
          title="Languages"
          value={formatNumber(languages.length)}
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Languages</h3>

          {languages.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-500">
              No language statistics available.
            </div>
          ) : (
            (() => {
              const total = languages.reduce(
                (sum, language) => sum + language.count,
                0,
              );

              return (
                <div className="space-y-4">
                  {languages.map((language) => {
                    const percentage =
                      total === 0
                        ? 0
                        : ((language.count / total) * 100).toFixed(1);

                    return (
                      <div
                        key={language.extension || "unknown"}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-slate-300">
                            {language.extension || "Unknown"}
                          </span>

                          <span className="text-sm text-slate-400">
                            {language.count} files • {percentage}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Largest Files
          </h3>

          {largestFiles.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-500">
              No file information available.
            </div>
          ) : (
            <div className="space-y-3">
              {largestFiles.map((file) => (
                <div
                  key={file.path}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                >
                  <div
                    className="truncate font-medium text-slate-200"
                    title={file.path}
                  >
                    {file.path}
                  </div>

                  <div className="mt-2 text-sm text-slate-500">
                    {formatBytes(file.sizeBytes)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatisticCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex items-center gap-3 text-blue-400">
        {icon}
        <span className="font-medium">{title}</span>
      </div>

      <div className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}
