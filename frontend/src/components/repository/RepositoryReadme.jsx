import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { getRepositoryReadme } from "../../services/repository.service";

export default function RepositoryReadme({ repositoryId }) {
  const [readme, setReadme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReadme();
  }, [repositoryId]);

  async function loadReadme() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getRepositoryReadme(repositoryId);

      setReadme(response.readme);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load README.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading README...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!readme) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <BookOpen size={48} className="text-slate-500" />

        <h3 className="mt-5 text-xl font-semibold text-white">
          No README Found
        </h3>

        <p className="mt-2 text-slate-400">
          This repository doesn't contain a supported README file.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-slate-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">{readme.name}</h3>

        <p className="mt-1 text-sm text-slate-400">{readme.path}</p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none overflow-x-auto p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              }

              return (
                <code className="rounded bg-slate-800 px-1.5 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {readme.content}
        </ReactMarkdown>
      </div>
    </>
  );
}
