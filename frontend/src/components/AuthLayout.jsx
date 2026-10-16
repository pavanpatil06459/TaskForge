
import { Link } from "react-router-dom";

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <Link
          to="/"
          className="mb-8 flex flex-col items-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4F46E5] text-3xl font-bold text-white shadow-lg shadow-indigo-200">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-50">
            TaskForge
          </h1>

          <p className="mt-2 text-center text-sm text-slate-50">
            {subtitle}
          </p>
        </Link>

        {/* Form card */}
        <div className="rounded-2xl border border-white/60 bg-white/95 p-6 shadow-xl shadow-indigo-950/10 backdrop-blur-md sm:p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-50">
          Plan smarter. Get more done.
        </p>
      </div>
    </div>
  );
}
