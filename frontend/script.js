// ==========================================================
// Task Manager - Frontend Logic
// Talks to our own PHP backend using fetch()
// ==========================================================

// Change this if your backend folder lives somewhere else on XAMPP.
// Example: if backend/ is inside htdocs/task-manager/backend, use that path.
const API_BASE = "http://localhost/task-manager/backend";

// ---- State ----
let tasks = [];        // in-memory copy of tasks fetched from the server
let editingId = null;  // id of the task currently being edited, or null

// ---- DOM references ----
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const submitBtn = document.getElementById("submit-btn");
const submitText = document.getElementById("submit-text");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

const taskListEl = document.getElementById("task-list");
const emptyStateEl = document.getElementById("empty-state");
const taskCountEl = document.getElementById("task-count");
const taskTemplate = document.getElementById("task-template");

// ---- Helpers: loading / error UI ----
function showLoading() {
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
}

function hideLoading() {
  loadingEl.classList.add("hidden");
}

function showError(message) {
  errorEl.textContent = "\u274C " + (message || "Something went wrong. Please try again.");
  errorEl.classList.remove("hidden");
}

function hideError() {
  errorEl.classList.add("hidden");
}

// ---- Render ----
function render() {
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  taskCountEl.textContent = tasks.length;

  tasks.forEach((task) => {
    const node = taskTemplate.content.cloneNode(true);
    const li = node.querySelector(".task-item");

    li.dataset.id = task.id;
    if (task.is_completed) li.classList.add("completed");

    const checkbox = node.querySelector(".task-toggle");
    checkbox.checked = !!task.is_completed;

    node.querySelector(".task-title").textContent = task.title;
    node.querySelector(".task-desc").textContent = task.description || "";

    // Wire up events for this specific task
    checkbox.addEventListener("change", () => toggleComplete(task));
    node.querySelector(".btn-edit").addEventListener("click", () => startEdit(task));
    node.querySelector(".btn-delete").addEventListener("click", () => deleteTask(task.id));

    taskListEl.appendChild(node);
  });
}

// ==========================================================
// READ - load all tasks from the backend
// ==========================================================
async function loadTasks() {
  showLoading();
  hideError();

  try {
    const res = await fetch(`${API_BASE}/get_tasks.php`);
    if (!res.ok) throw new Error("Server responded with an error");

    const result = await res.json();
    if (!result.success) throw new Error(result.message || "Failed to load tasks");

    tasks = result.data;
    render();
  } catch (err) {
    console.error(err);
    showError("Could not load tasks. Please try again.");
  } finally {
    hideLoading();
  }
}

// ==========================================================
// CREATE - add a new task
// ==========================================================
async function addTask(title, description) {
  hideError();

  try {
    const res = await fetch(`${API_BASE}/add_task.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });

    if (!res.ok) throw new Error("Server responded with an error");
    const result = await res.json();
    if (!result.success) throw new Error(result.message || "Failed to add task");

    // Update local state, then re-render (no full reload needed)
    tasks.unshift(result.data);
    render();
  } catch (err) {
    console.error(err);
    showError("Could not add the task. Please try again.");
  }
}

// ==========================================================
// UPDATE - edit title/description, or toggle completion
// ==========================================================
async function updateTask(id, title, description, isCompleted) {
  hideError();

  try {
    const res = await fetch(`${API_BASE}/update_task.php`, {
      method: "POST", // PHP file also accepts PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, description, is_completed: isCompleted })
    });

    if (!res.ok) throw new Error("Server responded with an error");
    const result = await res.json();
    if (!result.success) throw new Error(result.message || "Failed to update task");

    // Update local state
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.title = title;
      task.description = description;
      task.is_completed = isCompleted;
    }
    render();
  } catch (err) {
    console.error(err);
    showError("Could not update the task. Please try again.");
  }
}

function toggleComplete(task) {
  updateTask(task.id, task.title, task.description, !task.is_completed);
}

function startEdit(task) {
  editingId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || "";
  submitText.textContent = "Save Changes";
  cancelEditBtn.classList.remove("hidden");
  titleInput.focus();
}

function stopEdit() {
  editingId = null;
  form.reset();
  submitText.textContent = "Add Task";
  cancelEditBtn.classList.add("hidden");
}

// ==========================================================
// DELETE - remove a task
// ==========================================================
async function deleteTask(id) {
  hideError();

  const confirmed = confirm("Delete this task? This cannot be undone.");
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_BASE}/delete_task.php`, {
      method: "POST", // PHP file also accepts DELETE
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (!res.ok) throw new Error("Server responded with an error");
    const result = await res.json();
    if (!result.success) throw new Error(result.message || "Failed to delete task");

    // Update local state
    tasks = tasks.filter((t) => t.id !== id);
    if (editingId === id) stopEdit();
    render();
  } catch (err) {
    console.error(err);
    showError("Could not delete the task. Please try again.");
  }
}

// ==========================================================
// Form submit handles both Create and Update
// ==========================================================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!title) return;

  if (editingId === null) {
    addTask(title, description);
    form.reset();
  } else {
    const task = tasks.find((t) => t.id === editingId);
    const isCompleted = task ? task.is_completed : false;
    updateTask(editingId, title, description, isCompleted);
    stopEdit();
  }
});

cancelEditBtn.addEventListener("click", stopEdit);

// ---- Init ----
loadTasks();
