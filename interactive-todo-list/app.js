const STORAGE_KEY = "interactive-todo-tasks";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const progress = document.getElementById("progress");
const emptyState = document.getElementById("empty-state");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");
const allCount = document.getElementById("all-count");
const activeCount = document.getElementById("active-count");
const doneCount = document.getElementById("done-count");
const toast = document.getElementById("toast");

let tasks = load();
let currentFilter = "all";
let toastTimeout;

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(task =>
      task &&
      (typeof task.id === "string" || typeof task.id === "number") &&
      typeof task.text === "string" &&
      typeof task.done === "boolean"
    );
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    showToast("Unable to save tasks in this browser.");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
}

function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter(task => !task.done);
  if (currentFilter === "done") return tasks.filter(task => task.done);
  return tasks;
}

function render() {
  list.replaceChildren();

  const visibleTasks = getVisibleTasks();
  const remaining = tasks.filter(task => !task.done).length;
  const completed = tasks.length - remaining;

  count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  allCount.textContent = tasks.length;
  activeCount.textContent = remaining;
  doneCount.textContent = completed;
  progress.style.width = tasks.length ? `${(completed / tasks.length) * 100}%` : "0%";

  filterButtons.forEach(button => {
    const selected = button.dataset.filter === currentFilter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;
    item.dataset.id = String(task.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" ${task.done ? "active" : "completed"}`);
    checkbox.dataset.action = "toggle";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.dataset.action = "delete";

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTasks.length > 0;
  if (visibleTasks.length === 0) {
    const heading = emptyState.querySelector("h2");
    const description = emptyState.querySelector("p");
    if (tasks.length && currentFilter === "active") {
      heading.textContent = "All caught up!";
      description.textContent = "You've completed every task. Nice work.";
    } else if (tasks.length && currentFilter === "done") {
      heading.textContent = "No completed tasks";
      description.textContent = "Completed tasks will show up here.";
    } else {
      heading.textContent = "Nothing here yet";
      description.textContent = "Add a task above and make today count.";
    }
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    showToast("Please enter a task first.");
    return;
  }

  tasks.unshift({
    id: (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    done: false
  });

  input.value = "";
  currentFilter = "all";
  save();
  render();
  input.focus();
});

list.addEventListener("click", event => {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;

  const item = actionElement.closest(".task-item");
  if (!item) return;

  const taskId = item.dataset.id;
  const task = tasks.find(entry => String(entry.id) === taskId);
  if (!task) return;

  if (actionElement.dataset.action === "delete") {
    tasks = tasks.filter(entry => String(entry.id) !== taskId);
    showToast("Task deleted.");
  } else if (actionElement.dataset.action === "toggle") {
    task.done = actionElement.checked;
  }

  save();
  render();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    render();
  });
});

clearCompletedButton.addEventListener("click", () => {
  const completedCount = tasks.filter(task => task.done).length;
  if (!completedCount) {
    showToast("There are no completed tasks to clear.");
    return;
  }
  tasks = tasks.filter(task => !task.done);
  save();
  render();
  showToast(`${completedCount} completed ${completedCount === 1 ? "task" : "tasks"} cleared.`);
});

render();
