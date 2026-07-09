import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import Modal from "../ui/Modal";
import { explainRepositoryFile } from "../../services/repository.service";

export default function FileExplanationModal({
  repositoryId,
  file,
  isOpen,
  onClose,
}) {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !file) {
      return;
    }

    loadExplanation();
  }, [isOpen, file?.id]);

  useEffect(() => {
    if (!isOpen) {
      setExplanation("");
      setCopied(false);
    }
  }, [isOpen]);

  async function loadExplanation() {
    try {
      setExplanation("");
      setIsLoading(true);

      const response = await explainRepositoryFile(repositoryId, file.id);

      setExplanation(response.explanation);
    } catch (error) {
      setExplanation(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate explanation.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(explanation);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Explain: ${file?.name ?? ""}`}
      maxWidth="max-w-5xl"
    >
      <div className="p-6">
        {isLoading ? (
          <p className="text-slate-400">Generating explanation...</p>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");

                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="rounded bg-slate-800 px-1 py-0.5"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {explanation}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
