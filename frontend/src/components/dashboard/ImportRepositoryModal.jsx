import { useEffect, useState } from "react";

import { importRepository } from "../../services/repository.service";

export default function ImportRepositoryModal({
  isOpen,
  onClose,
  onImportSuccess,
}) {
  const [githubUrl, setGithubUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setGithubUrl("");
      setError("");
      setIsImporting(false);
    }
  }, [isOpen]);

  async function handleImport() {
    const trimmedUrl = githubUrl.trim();

    if (!trimmedUrl) {
      console.log("URL missing");
      setError("Repository URL is required.");
      return;
    }

    try {
      setError("");
      setIsImporting(true);

      const repository = await importRepository(trimmedUrl);

      if (onImportSuccess) {
        onImportSuccess(repository);
      }

      onClose();
    } catch (error) {
      console.error("Import failed:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to import repository.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white">Import Repository</h2>

        <p className="mt-2 text-slate-400">
          Paste the URL of any public GitHub repository.
        </p>

        <div className="mt-8">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Repository URL
          </label>

          <input
            type="text"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            placeholder="https://github.com/facebook/react"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          />

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isImporting}
            className="rounded-xl border border-slate-700 px-5 py-3 text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting
              ? "Importing...This may take upto a few minutes"
              : "Import Repository"}
          </button>
        </div>
      </div>
    </div>
  );
}
