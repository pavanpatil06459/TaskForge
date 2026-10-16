import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./services/todoApi";
import { ThemeProvider } from "./context/ThemeContext";

const PRIORITIES = ["Low", "Medium", "High"];

function PriorityBadge({ priority }) {
  const value = PRIORITIES.includes(priority) ? priority : "Medium";

  const styles = {
    High: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    Medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles[value]}`}
    >
      {value}
    </span>
  );
}

function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  // GET: Fetch tasks from backend
  async function loadTodos() {
    try {
      setError("");

      const data = await getTodos();
      const list = Array.isArray(data) ? data : data?.todos;

      if (!Array.isArray(list)) {
        throw new Error("The server response does not contain a Todo list.");
      }

      setTodos(list);
    } catch (err) {
      setError(err.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  // Statistics
  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  // Search and filter
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !todo.completed) ||
      (filter === "Completed" && todo.completed);

    return matchesSearch && matchesFilter;
  });

  // Create or edit a task
  async function handleSubmit(e) {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle || saving) return;

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        await updateTodo(editingId, {
          title: cleanTitle,
          priority,
        });
      } else {
        await createTodo(cleanTitle, priority);
      }

      setTitle("");
      setPriority("Medium");
      setEditingId(null);

      await loadTodos();
    } catch (err) {
      setError(err.message || "Could not save the task.");
    } finally {
      setSaving(false);
    }
  }

  // Toggle completed status
  async function toggleTodo(todo) {
    const id = todo._id ?? todo.id;

    try {
      setError("");

      await updateTodo(id, {
        title: todo.title,
        completed: !todo.completed,
      });

      await loadTodos();
    } catch (err) {
      setError(err.message || "Could not update the task.");
    }
  }

  // Load task into form
  function editTodo(todo) {
    setTitle(todo.title);
    setPriority(PRIORITIES.includes(todo.priority) ? todo.priority : "Medium");
    setEditingId(todo._id ?? todo.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete a task
  async function removeTodo(todo) {
    const id = todo._id ?? todo.id;

    try {
      setError("");

      await deleteTodo(id);

      if (editingId === id) {
        cancelEdit();
      }

      await loadTodos();
    } catch (err) {
      setError(err.message || "Could not delete the task.");
    }
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setPriority("Medium");
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main className="px-4 pb-8 pt-2 sm:px-6 sm:pb-12 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          {/* Header */}

          <header className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                TaskForge
              </h1>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Organize your day, one task at a time.
              </p>
            </div>
          </header>

          {/* Statistics */}
          <section className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
            <Stat
              label="TOTAL"
              count={todos.length}
              color="text-slate-900 dark:text-white"
            />

            <Stat
              label="COMPLETED"
              count={completedCount}
              color="text-emerald-600 dark:text-emerald-400"
            />

            <Stat
              label="PENDING"
              count={pendingCount}
              color="text-amber-600 dark:text-amber-400"
            />
          </section>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={loadTodos}
                className="mt-2 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Create / Edit form */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-4 text-lg font-bold">
              {editingId !== null ? "Edit task" : "Add a new task"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                aria-label="Todo title"
                required
                className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-950"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  aria-label="Task priority"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>

                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save changes"
                      : "+ Add task"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Tasks */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-bold">Your tasks</h2>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {pendingCount} pending
                </span>
              </div>

              {/* Search */}
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              {/* Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["All", "Pending", "Completed"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      filter === option
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-14 text-slate-500 dark:text-slate-400">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                Loading your tasks...
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <div className="mb-4 text-5xl">📝</div>

                <h3 className="text-lg font-bold">
                  {todos.length === 0 ? "No tasks yet" : "No matching tasks"}
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {todos.length === 0
                    ? "Add your first task above!"
                    : "Try another search or filter."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTodos.map((todo) => (
                  <li
                    key={todo._id ?? todo.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:flex-nowrap sm:gap-4 sm:px-6"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(todo.completed)}
                      onChange={() => toggleTodo(todo)}
                      aria-label={`Mark ${todo.title} as ${
                        todo.completed ? "pending" : "completed"
                      }`}
                      className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                    />

                    <span
                      className={`min-w-0 flex-1 break-words text-sm font-medium sm:text-base ${
                        todo.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {todo.title}
                    </span>

                    <PriorityBadge priority={todo.priority} />

                    <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-0">
                      <button
                        type="button"
                        onClick={() => editTodo(todo)}
                        className="rounded-lg px-2 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 sm:px-3"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => removeTodo(todo)}
                        className="rounded-lg px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 sm:px-3"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!loading && todos.length > 0 && (
              <footer className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                {completedCount} of {todos.length} tasks completed
              </footer>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, count, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-bold sm:text-3xl ${color}`}>{count}</p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<TodoDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
