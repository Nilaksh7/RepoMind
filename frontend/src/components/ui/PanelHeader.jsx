export default function PanelHeader({ title, right }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
      <h2 className="font-semibold text-white">{title}</h2>

      {right}
    </div>
  );
}
