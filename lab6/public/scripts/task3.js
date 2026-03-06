const STORAGE_KEY = "lab6-kanban-state";

const addTaskForm = document.querySelector("#addTaskForm");
const taskTitleInput = document.querySelector("#taskTitleInput");
const taskPrioritySelect = document.querySelector("#taskPrioritySelect");
const board = document.querySelector("#kanbanBoard");
const lists = document.querySelectorAll(".kanban-list");

let boardState = loadState();

function createDefaultState() {
  return {
    todo: [
      { id: "task-1", title: "Exam prep", priority: "high" },
      { id: "task-2", title: "Review DOM notes", priority: "medium" }
    ],
    inprogress: [],
    done: []
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createDefaultState();
  }

  try {
    const parsed = JSON.parse(saved);
    if (parsed.todo && parsed.inprogress && parsed.done) {
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse state:", error);
  }

  return createDefaultState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boardState));
}

function createPriorityBadge(priority) {
  const badge = document.createElement("span");
  badge.className = `priority priority-${priority}`;
  badge.textContent = priority.toUpperCase();
  return badge;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task-card";
  item.draggable = true;
  item.dataset.taskId = task.id;

  const head = document.createElement("div");
  head.className = "task-head";

  const title = document.createElement("strong");
  title.textContent = task.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-task";
  deleteBtn.dataset.taskId = task.id;
  deleteBtn.textContent = "Delete";

  head.appendChild(title);
  head.appendChild(deleteBtn);

  item.appendChild(head);
  item.appendChild(createPriorityBadge(task.priority));

  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", task.id);
  });

  return item;
}

function renderBoard() {
  lists.forEach((list) => {
    const column = list.dataset.column;
    list.innerHTML = "";
    boardState[column].forEach((task) => {
      list.appendChild(createTaskElement(task));
    });
  });
}

function getTaskLocation(taskId) {
  const columns = Object.keys(boardState);
  for (const column of columns) {
    const taskIndex = boardState[column].findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      return { column, index: taskIndex };
    }
  }
  return null;
}

function moveTask(taskId, targetColumn) {
  const source = getTaskLocation(taskId);
  if (!source || source.column === targetColumn) {
    return;
  }

  const [movedTask] = boardState[source.column].splice(source.index, 1);
  boardState[targetColumn].push(movedTask);
  saveState();
  renderBoard();
}

function deleteTask(taskId) {
  const source = getTaskLocation(taskId);
  if (!source) {
    return;
  }

  boardState[source.column].splice(source.index, 1);
  saveState();
  renderBoard();
}

addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;

  if (!title) {
    return;
  }

  boardState.todo.push({
    id: `task-${Date.now()}`,
    title,
    priority
  });

  saveState();
  renderBoard();
  addTaskForm.reset();
});

lists.forEach((list) => {
  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    list.classList.add("dragging-over");
  });

  list.addEventListener("dragleave", () => {
    list.classList.remove("dragging-over");
  });

  list.addEventListener("drop", (event) => {
    event.preventDefault();
    list.classList.remove("dragging-over");
    const taskId = event.dataTransfer.getData("text/plain");
    const targetColumn = list.dataset.column;
    moveTask(taskId, targetColumn);
  });
});

board.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest("button.delete-task");
  if (!deleteBtn) {
    return;
  }

  deleteTask(deleteBtn.dataset.taskId);
});

renderBoard();
saveState();
