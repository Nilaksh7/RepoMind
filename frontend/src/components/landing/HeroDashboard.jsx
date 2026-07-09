export default function HeroDashboard() {
  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Repository
          </p>

          <h3 className="mt-1 text-xl font-semibold text-white">
            facebook / react
          </h3>
        </div>

        <span className="rounded-lg border border-emerald-700/30 bg-emerald-600/10 px-4 py-2 text-sm font-medium text-emerald-400">
          Indexed
        </span>
      </div>

      {/* Main */}
      <div className="grid grid-cols-12">
        {/* Repository */}
        <div className="col-span-3 border-r border-slate-800 bg-slate-950 p-5">
          <p className="mb-4 text-sm font-medium text-slate-500">Repository</p>

          <div className="space-y-3 text-sm text-slate-300">
            <p>src</p>
            <p>components</p>
            <p>pages</p>
            <p>services</p>
            <p>package.json</p>
            <p>README.md</p>
          </div>
        </div>

        {/* Code */}
        <div className="col-span-5 border-r border-slate-800 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-white">auth.middleware.js</h4>

            <span className="text-xs text-slate-500">JavaScript</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <pre className="overflow-hidden text-sm leading-7 text-slate-400">
              {`const token = req.headers.authorization;

if (!token)
  return res.status(401);

const payload = verify(token);

req.user = payload;`}
            </pre>
          </div>
        </div>

        {/* Ask RepoMind */}
        <div className="col-span-4 p-5">
          <p className="mb-4 text-sm font-medium text-slate-500">
            Ask RepoMind
          </p>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm text-slate-300">
              How is authentication implemented?
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-blue-900/30 bg-blue-600/10 p-4">
            <p className="text-sm leading-7 text-slate-300">
              Google OAuth authenticates users while JWT middleware validates
              every request before repository access is granted.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 text-sm text-slate-500">
        <div className="flex gap-6">
          <span>126 Files</span>
          <span>JavaScript</span>
          <span>Indexed</span>
        </div>

        <span>Updated 2 minutes ago</span>
      </div>
    </div>
  );
}
