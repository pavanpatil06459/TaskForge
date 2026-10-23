const BASE_URL = "https://taskforge-backend-4ju1.onrender.com";

const API_URL = `${BASE_URL}/todo`;
const AUTH_URL = `${BASE_URL}/auth`;

// Get the logged-in user's token
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// GET: Fetch only the logged-in user's Todos
export async function getTodos() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch Todos");
  }

  return data;
}

// POST: Create a Todo
export async function createTodo(title) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, priority }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Todo");
  }

  return data;
}

// PUT: Update a Todo
export async function updateTodo(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update Todo");
  }

  return data;
}

// DELETE: Delete a Todo
export async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete Todo");
  }

  return data;
}

// GET: Fetch the logged-in user's saved theme
export async function getTheme() {
  const response = await fetch(`${AUTH_URL}/theme`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch theme");
  }

  return data.theme;
}

// PUT: Save the logged-in user's theme
export async function updateTheme(theme) {
  const response = await fetch(`${AUTH_URL}/theme`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update theme");
  }

  return data.theme;
}