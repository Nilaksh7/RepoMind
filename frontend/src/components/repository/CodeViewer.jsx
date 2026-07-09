import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Sparkles } from "lucide-react";

import { getRepositoryFile } from "../../services/repository.service";
import FileExplanationModal from "./FileExplanationModal";

export default function CodeViewer({ repositoryId, selectedFile }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  useEffect(() => {
    if (!selectedFile || selectedFile.type !== "file") {
      setFile(null);
      return;
    }

    loadFile();
  }, [selectedFile]);

  async function loadFile() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getRepositoryFile(repositoryId, selectedFile.id);

      setFile(response.file);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load file.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!file?.content) {
      return;
    }

    await navigator.clipboard.writeText(file.content);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function formatFileSize(bytes) {
    if (!bytes) {
      return "0 B";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (!selectedFile) {
    return (
      <section className="col-span-6 flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
        <p className="text-slate-500">
          Select a file from the repository explorer.
        </p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="col-span-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">Loading file...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="col-span-6 rounded-2xl border border-red-900 bg-red-950/30 p-6">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  function getLanguage(extension) {
    switch (extension) {
      case ".js":
      case ".cjs":
      case ".mjs":
        return "javascript";

      case ".jsx":
        return "jsx";

      case ".ts":
        return "typescript";

      case ".tsx":
        return "tsx";

      case ".py":
        return "python";

      case ".cpp":
      case ".cc":
        return "cpp";

      case ".c":
        return "c";

      case ".java":
        return "java";

      case ".json":
        return "json";

      case ".html":
        return "html";

      case ".css":
        return "css";

      case ".scss":
        return "scss";

      case ".sql":
        return "sql";

      case ".md":
        return "markdown";

      case ".yml":
      case ".yaml":
        return "yaml";

      case ".sh":
        return "bash";

      default:
        return "text";
    }
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {selectedFile.name}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {file?.path}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {file?.extension || "Unknown"}
              </span>

              <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {formatFileSize(file?.sizeBytes)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExplanationOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Sparkles size={16} />
              Explain
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={getLanguage(file?.extension)}
          style={oneDark}
          showLineNumbers
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            background: "#0f172a",
            fontSize: "14px",
            minHeight: "650px",
          }}
          codeTagProps={{
            style: {
              fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
            },
          }}
        >
          {file?.content || ""}
        </SyntaxHighlighter>
      </div>

      <FileExplanationModal
        repositoryId={repositoryId}
        file={file}
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
      />
    </section>
  );
}
