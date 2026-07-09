import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import HeroDashboard from "./HeroDashboard";

export default function Hero({ onStartExploring }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  function handleGetStarted() {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    onStartExploring();
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-between gap-20 px-6 py-28">
      {/* Left */}
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
          AI-powered Repository Intelligence
        </div>

        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-7xl">
          Understand Any
          <br />
          GitHub Repository
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            with RepoMind
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
          Import any public GitHub repository, explore project structure, search
          code semantically, inspect repository insights, and understand
          unfamiliar codebases through AI-powered analysis—all from a single,
          developer-focused workspace.
        </p>

        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={handleGetStarted}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
          >
            {isAuthenticated ? "Open Dashboard →" : "Start Exploring →"}
          </button>

          <p className="text-sm text-slate-500">
            Free • Google Sign-In • No Installation Required
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="hidden flex-1 justify-end lg:flex">
        <HeroDashboard />
      </div>
    </section>
  );
}
