import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function LandingNavbar({ onStartExploring }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  function handleGetStarted() {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    onStartExploring();
  }

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold tracking-tight"
        >
          <span className="text-slate-900 dark:text-white">Repo</span>

          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Mind
          </span>
        </button>

        {/* Navigation */}
        <div className="hidden items-center gap-10 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <button
            onClick={() => scrollToSection("features")}
            className="transition hover:text-blue-600"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="transition hover:text-blue-600"
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection("faq")}
            className="transition hover:text-blue-600"
          >
            FAQ
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleGetStarted}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {isAuthenticated ? "Open Dashboard" : "Start Exploring"}
          </button>
        </div>
      </nav>
    </header>
  );
}
