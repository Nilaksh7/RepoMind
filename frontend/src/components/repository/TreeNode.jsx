import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";

export default function TreeNode({
  node,
  level,
  selectedFileId,
  onFileSelect,
  searchQuery,
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const isDirectory = node.type === "directory";
  const isSelected = !isDirectory && selectedFileId === node.id;

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsExpanded(true);
    } else {
      setIsExpanded(level === 0);
    }
  }, [searchQuery, level]);

  function handleClick() {
    if (isDirectory) {
      setIsExpanded((previous) => !previous);
      return;
    }

    onFileSelect(node);
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
          isSelected
            ? "bg-blue-600/20 text-blue-300"
            : "text-slate-300 hover:bg-slate-800"
        }`}
        style={{ paddingLeft: `${level * 18 + 12}px` }}
      >
        {isDirectory ? (
          <>
            {isExpanded ? (
              <ChevronDown size={15} className="shrink-0 text-slate-500" />
            ) : (
              <ChevronRight size={15} className="shrink-0 text-slate-500" />
            )}

            {isExpanded ? (
              <FolderOpen size={16} className="shrink-0 text-amber-400" />
            ) : (
              <Folder size={16} className="shrink-0 text-amber-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-[15px]" />
            <FileText
              size={15}
              className={isSelected ? "text-blue-300" : "text-slate-500"}
            />
          </>
        )}

        <span className="truncate">{node.name}</span>
      </button>

      {isDirectory &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            selectedFileId={selectedFileId}
            onFileSelect={onFileSelect}
            searchQuery={searchQuery}
          />
        ))}
    </div>
  );
}
