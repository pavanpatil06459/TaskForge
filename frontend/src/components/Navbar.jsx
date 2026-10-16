import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signingOutMessage, setSigningOutMessage] = useState("");

  const { darkMode, toggleTheme, resetTheme } = useTheme();
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  function handleLogout() {
    setSigningOutMessage("Signing out...");
    setIsSigningOut(true);
    setProfileOpen(false);
    setMenuOpen(false);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      resetTheme(); // only resets the screen, saved theme in DB stays
      navigate("/login", { replace: true });
    }, 1000);
  }

  function handleCreateNewUser() {
    setSigningOutMessage("Creating new user...");
    setIsSigningOut(true);
    setProfileOpen(false);
    setMenuOpen(false);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      resetTheme(); // only resets the screen, saved theme in DB stays
      navigate("/register", { replace: true });
    }, 1000);
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  const themeButtonClass =
    "rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800";

  // Logout / Create User transition
  if (isSigningOut) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-colors dark:bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />

        <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
          {signingOutMessage}
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {signingOutMessage === "Creating new user..."
            ? "Preparing your registration page"
            : "Please wait while we securely sign you out"}
        </p>
      </div>
    );
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-lg transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            ✓
          </span>

          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            Task<span className="text-indigo-600">Forge</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Desktop theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className={`${themeButtonClass} hidden md:inline-flex`}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-3 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {(user.name || user.fullName || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <span className="hidden max-w-32 truncate text-sm font-semibold text-slate-700 dark:text-slate-200 sm:block">
                {user.name || user.fullName || "My Account"}
              </span>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                ▼
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {user.name || user.fullName || "Welcome!"}
                  </p>

                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {user.email || "Logged-in user"}
                  </p>
                </div>

                {/* Mobile theme toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
                >
                  <span>Appearance</span>
                  <span>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
                </button>

                {/* Create New User */}
                <button
                  type="button"
                  onClick={handleCreateNewUser}
                  className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                >
                  Create New User
                </button>

                {/* Sign out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white p-3 shadow-lg transition-colors dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}