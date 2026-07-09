import { FileCode, FileJson, FileType2, File } from "lucide-react";

import { Handle, Position } from "reactflow";

const COLORS = {
  js: "#f7df1e",
  jsx: "#61dafb",
  ts: "#3178c6",
  tsx: "#3178c6",
  py: "#4caf50",
  java: "#f44336",
};

const LABELS = {
  js: "JavaScript",
  jsx: "React",
  ts: "TypeScript",
  tsx: "React TS",
  py: "Python",
  java: "Java",
};

function getIcon(type) {
  switch (type) {
    case "js":
    case "jsx":
      return <FileJson size={18} />;

    case "ts":
    case "tsx":
      return <FileType2 size={18} />;

    case "py":
    case "java":
      return <FileCode size={18} />;

    default:
      return <File size={18} />;
  }
}

export default function DependencyNode({ data }) {
  const color = COLORS[data.type] || "#64748b";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          background: color,
          border: "none",
        }}
      />

      <div
        title={data.path}
        className="min-w-[220px] rounded-xl border bg-slate-900 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
        style={{
          borderColor: color,
        }}
      >
        <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
          <div style={{ color }}>{getIcon(data.type)}</div>

          <span className="truncate text-sm font-semibold text-white">
            {data.label}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2">
          <span
            className="rounded-full px-2 py-1 text-xs font-medium"
            style={{
              background: `${color}20`,
              color,
            }}
          >
            {LABELS[data.type] || data.type.toUpperCase()}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 8,
          height: 8,
          background: color,
          border: "none",
        }}
      />
    </>
  );
}
