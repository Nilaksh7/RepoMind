export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="p-6">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
