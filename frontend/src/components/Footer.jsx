
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} TaskForge. All rights reserved.
      </p>
    </footer>
  );
}
