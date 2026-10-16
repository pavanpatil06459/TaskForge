
import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://taskforge-backend-4ju1.onrender.com/contact";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit your message.");
      }

      setSuccess(
        data.message || "Your message has been submitted successfully!"
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Could not connect to the server. Please check that your backend is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-950";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-12 pt-28 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm transition-colors dark:bg-slate-900">
          {/* Hero Section */}
          <div className="bg-indigo-600 px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              ✉
            </div>

            <h1 className="text-3xl font-extrabold">Contact Us</h1>

            <p className="mx-auto mt-3 max-w-lg text-indigo-100">
              Have a question or suggestion? Send us a message.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {/* Success Message */}
            {success && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
              >
                ✓ {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  required
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={254}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className={labelClass}>
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={150}
                  required
                  placeholder="What is this regarding?"
                  className={inputClass}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={labelClass}>
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={2000}
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                  {form.message.length}/2000
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
