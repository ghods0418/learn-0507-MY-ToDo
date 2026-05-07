const TODO_STORAGE_KEY = "simple-todo-list-items";
const THEME_STORAGE_KEY = "simple-todo-list-theme";
const QUOTE_INDEX_STORAGE_KEY = "simple-todo-list-quote-index";

let todos = [];
let currentFilter = "all";

const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-button");
const themeToggleButton = document.getElementById("theme-toggle-button");
const motivationQuote = document.getElementById("motivation-quote");

const motivationQuotes = [
  "오늘 하나를 미루면 내일 두 개를 해야 한다.",
  "작은 시작이 결국 큰 완성을 만든다.",
  "지금 10분의 집중이 하루의 방향을 바꾼다.",
  "완벽함보다 끝내는 힘이 더 중요하다.",
  "한 걸음만 더 가면 어제의 나를 넘는다.",
  "미루는 습관은 기회를 가장 먼저 지운다.",
  "계획은 짧게, 실행은 바로.",
  "지금 하는 일이 미래의 자신을 돕는다.",
  "도전은 두려움이 아니라 선택의 문제다.",
  "오늘 해낸 한 가지가 내일의 자신감을 만든다.",
];

function saveTodos() {
  const dataToStore = {
    todos,
    currentFilter,
  };

  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(dataToStore));
}

function loadTodos() {
  const storedTodos = localStorage.getItem(TODO_STORAGE_KEY);

  if (!storedTodos) {
    todos = [];
    return;
  }

  try {
    const parsed = JSON.parse(storedTodos);
    if (Array.isArray(parsed)) {
      todos = parsed;
      currentFilter = "all";
      return;
    }

    todos = Array.isArray(parsed.todos) ? parsed.todos : [];
    currentFilter =
      parsed.currentFilter === "completed" || parsed.currentFilter === "active"
        ? parsed.currentFilter
        : "all";
  } catch (error) {
    todos = [];
    currentFilter = "all";
  }
}

function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  todoInput.value = "";

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);

  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const targetTodo = todos.find((todo) => todo.id === id);

  if (!targetTodo) {
    return;
  }

  const editedText = prompt("할 일을 수정하세요.", targetTodo.text);

  if (editedText === null) {
    return;
  }

  const trimmedText = editedText.trim();

  if (!trimmedText) {
    alert("빈 값으로는 수정할 수 없습니다.");
    return;
  }

  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, text: trimmedText, completed: false } : todo
  );

  saveTodos();
  renderTodos();
}

function updateFilterButtonCounts() {
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  filterButtons.forEach((button) => {
    if (button.dataset.filter === "all") {
      button.textContent = `전체(${totalCount})`;
    }

    if (button.dataset.filter === "completed") {
      button.textContent = `완료(${completedCount})`;
    }

    if (button.dataset.filter === "active") {
      button.textContent = `미완료(${activeCount})`;
    }
  });
}

function getFilteredTodos() {
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return [...activeTodos, ...completedTodos];
}

function renderTodos() {
  todoList.innerHTML = "";
  updateFilterButtonCounts();

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent =
      todos.length === 0
        ? "할 일을 추가해보세요."
        : "선택한 조건에 맞는 할 일이 없습니다.";
    todoList.appendChild(emptyMessage);
    return;
  }

  filteredTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";

    const main = document.createElement("div");
    main.className = "todo-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "완료 여부 변경");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = todo.completed ? "todo-text completed" : "todo-text";
    text.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.type = "button";
    editButton.textContent = "수정";
    editButton.addEventListener("click", () => editTodo(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    main.appendChild(checkbox);
    main.appendChild(text);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    item.appendChild(main);
    item.appendChild(actions);
    todoList.appendChild(item);
  });
}

function setFilter(nextFilter) {
  currentFilter = nextFilter;

  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isSelected);
  });

  saveTodos();
  renderTodos();
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeToggleButton.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggleButton.setAttribute(
    "aria-label",
    theme === "dark" ? "라이트모드로 전환" : "다크모드로 전환"
  );
}

function toggleTheme() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  const nextTheme = isDarkMode ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

function initializeTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = storedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);
}

function initializeMotivationQuote() {
  const storedIndex = Number(localStorage.getItem(QUOTE_INDEX_STORAGE_KEY));
  const currentIndex =
    Number.isInteger(storedIndex) && storedIndex >= 0
      ? storedIndex % motivationQuotes.length
      : 0;

  motivationQuote.textContent = motivationQuotes[currentIndex];

  const nextIndex = (currentIndex + 1) % motivationQuotes.length;
  localStorage.setItem(QUOTE_INDEX_STORAGE_KEY, String(nextIndex));
}

addButton.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setFilter(button.dataset.filter);
  });
});
themeToggleButton.addEventListener("click", toggleTheme);

initializeTheme();
initializeMotivationQuote();
loadTodos();
renderTodos();
