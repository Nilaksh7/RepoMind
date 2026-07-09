export default function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6">
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}
