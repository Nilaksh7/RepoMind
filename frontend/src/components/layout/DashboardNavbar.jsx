import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold tracking-tight"
        >
          <span className="text-white">Repo</span>

          <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Mind
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="h-9 w-9 rounded-full border border-slate-700"
            />
          )}

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-red-500 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
