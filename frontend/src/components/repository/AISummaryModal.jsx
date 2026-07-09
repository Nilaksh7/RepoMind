import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Modal from "../ui/Modal";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

import { getRepositorySummary } from "../../services/repository.service";

export default function AISummaryModal({ isOpen, onClose, repositoryId }) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadSummary();
  }, [isOpen, repositoryId]);

  async function loadSummary() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getRepositorySummary(repositoryId);

      setSummary(response.summary);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate repository summary.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ AI Repository Summary"
      maxWidth="max-w-4xl"
    >
      <div className="p-6">
        {isLoading && (
          <LoadingState message="Generating repository summary..." />
        )}

        {!isLoading && error && <ErrorState message={error} />}

        {!isLoading && !error && (
          <>
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-900/40 bg-blue-950/20 p-4">
              <Sparkles size={22} className="text-blue-400" />

              <p className="text-sm text-slate-300">
                This summary is AI-generated using your indexed repository.
              </p>
            </div>

            <article className="prose prose-invert prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
              </ReactMarkdown>
            </article>
          </>
        )}
      </div>
    </Modal>
  );
}
