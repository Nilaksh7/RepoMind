import { FileCode2 } from "lucide-react";

export default function SemanticSearchResults({ results, onFileSelect }) {
  if (!results.length) {
    return null;
  }

  function handleClick(result) {
    onFileSelect({
      id: result.file_id,
      name: result.file_name,
      path: result.file_path,
      extension: result.extension,
      type: "file",
    });
  }

  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center gap-2">
        <FileCode2 size={16} className="text-blue-400" />

        <h3 className="text-sm font-semibold text-white">Semantic Search</h3>
      </div>

      <div className="space-y-2">
        {results.map((result) => (
          <button
            key={`${result.file_id}-${result.chunk_index}`}
            onClick={() => handleClick(result)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-left transition hover:border-blue-500 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-medium text-white">
                {result.file_name}
              </span>

              <span className="rounded-full bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-300">
                {result.similarity.toFixed(1)}%
              </span>
            </div>

            <p className="mt-1 truncate text-xs text-slate-500">
              {result.file_path}
            </p>

            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-slate-300">
              {result.chunk_text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
