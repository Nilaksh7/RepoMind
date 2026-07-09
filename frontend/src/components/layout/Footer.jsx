export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Repo<span className="text-blue-400">Mind</span>
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            AI-powered repository intelligence for developers.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            © 2026 RepoMind. All rights reserved.
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Built by <span className="font-medium text-slate-400">Nilaksh</span>{" "}
            · Computer Science, NIT Delhi
          </p>
        </div>
      </div>
    </footer>
  );
}
