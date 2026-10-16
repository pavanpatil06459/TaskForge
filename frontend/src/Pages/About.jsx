
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-12 pt-28 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm transition-colors dark:bg-slate-900">
          {/* Hero Section */}
          <div className="bg-indigo-600 px-6 py-12 text-center text-white sm:px-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              ✓
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              About TaskForge
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
              Organize your day, stay focused, and turn your
              plans into progress.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 p-6 sm:p-10">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Our Mission
              </h2>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                TaskForge is a simple task management application
                designed to help you organize your daily work,
                track completed tasks, and stay productive.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                What You Can Do
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Feature
                  icon="📝"
                  title="Create Tasks"
                  description="Add tasks and keep your work organized."
                />

                <Feature
                  icon="✏️"
                  title="Edit Tasks"
                  description="Update task details whenever needed."
                />

                <Feature
                  icon="✅"
                  title="Track Progress"
                  description="Mark tasks complete and view your progress."
                />

                <Feature
                  icon="🔒"
                  title="User Authentication"
                  description="Access your account through login and registration."
                />
              </div>
            </section>

            {/* Dashboard CTA */}
            <div className="rounded-2xl bg-indigo-50 p-6 text-center transition-colors dark:bg-indigo-950/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Ready to get productive?
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Head to your dashboard and get started.
              </p>

              <Link
                to="/dashboard"
                className="mt-5 inline-flex cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 transition-colors duration-300 hover:border-indigo-200 hover:shadow-sm dark:border-slate-700 dark:hover:border-indigo-500">
      <span className="text-2xl">{icon}</span>

      <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
