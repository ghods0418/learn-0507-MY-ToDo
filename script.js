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
// 입력창 바로 아래에 표시할 에러 문구 영역입니다(평소에는 CSS로 숨깁니다).
const todoInputError = document.getElementById("todo-input-error");

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

/**
 * 흔들림 애니메이션이 끝났을 때 한 번만 실행됩니다.
 * .shake를 제거해야 같은 입력 오류가 연속으로 나도 애니메이션이 다시 재생됩니다.
 */
function handleTodoInputShakeEnd(event) {
  // 이벤트가 발생한 요소가 우리 입력창이 아니면 무시합니다(다른 요소 애니메이션과 구분).
  if (event.target !== todoInput) {
    return;
  }
  // 우리가 정의한 keyframes 이름과 일치할 때만 처리합니다.
  if (event.animationName !== "shake-input") {
    return;
  }
  // 애니메이션 종료 후 클래스를 떼어 둡니다.
  todoInput.classList.remove("shake");
}

/**
 * 에러 문구를 보이게 하고, 입력창에 시각적 강조와 흔들림을 줍니다.
 * @param {string} message 화면에 보여 줄 안내 문장
 */
function showTodoInputError(message) {
  // 스크린 리더 등 보조 기기에 "잘못된 입력"임을 알립니다.
  todoInput.setAttribute("aria-invalid", "true");
  // 테두리 강조 클래스를 붙여 눈에 띄게 합니다.
  todoInput.classList.add("input-error-outline");
  // 에러 문구를 설정하고 숨김 클래스를 떼어 실제로 보이게 합니다.
  todoInputError.textContent = message;
  todoInputError.classList.remove("is-hidden");
  // 이전에 붙어 있을 수 있는 shake를 한 번 지웁니다(연속 클릭 대비).
  todoInput.classList.remove("shake");
  // 브라우저에게 "레이아웃을 다시 계산해라"고 힌트를 주어 애니메이션을 초기화합니다.
  void todoInput.offsetWidth;
  // CSS에 정의된 .shake 애니메이션을 새로 시작합니다.
  todoInput.classList.add("shake");
}

/**
 * 에러 상태를 모두 걷어내 입력 영역을 평소 모습으로 되돌립니다.
 * 사용자가 다시 타이핑을 시작할 때도 호출합니다.
 */
function clearTodoInputError() {
  // 접근성: 더 이상 유효하지 않은 값이 아니라고 표시합니다.
  todoInput.setAttribute("aria-invalid", "false");
  // 시각적 강조와 흔들림 클래스를 모두 제거합니다.
  todoInput.classList.remove("input-error-outline", "shake");
  // 안내 문구를 비우고 다시 숨깁니다.
  todoInputError.textContent = "";
  todoInputError.classList.add("is-hidden");
}

function addTodo() {
  // 앞뒤 공백을 제거한 실제 입력 내용입니다.
  const text = todoInput.value.trim();

  // 내용이 비어 있으면 추가하지 않고, 화면 안에서만 부드럽게 안내합니다.
  if (!text) {
    showTodoInputError("내용을 입력해주세요!");
    return;
  }

  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  todoInput.value = "";
  // 성공적으로 추가되었으므로 이전에 떠 있던 에러 표시는 모두 지웁니다.
  clearTodoInputError();

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

  // 수정 내용이 비어 있으면 저장하지 않고, 목록 위 입력 영역에 안내합니다.
  if (!trimmedText) {
    showTodoInputError("수정 내용을 입력해주세요!");
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
    // 위임 클릭 처리에서 어떤 할 일인지 알 수 있도록 li에 고유 id를 data 속성으로 저장합니다.
    item.dataset.todoId = String(todo.id);

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

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";

    main.appendChild(checkbox);
    main.appendChild(text);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    item.appendChild(main);
    item.appendChild(actions);
    todoList.appendChild(item);
  });
}

/**
 * #todo-list에만 붙인 하나의 클릭 리스너에서 삭제·수정을 처리합니다(이벤트 위임).
 * 새 할 일이 그려져도 추가 리스너 등록이 필요 없습니다.
 */
function handleTodoListClick(event) {
  // 브라우저가 전달한 클릭 이벤트 객체입니다(어디를 눌렀는지 등의 정보가 들어 있습니다).
  const target = event.target;
  // 실제 클릭 지점에서 시작해 위쪽으로 올라가며 가장 가까운 .todo-item 조상을 찾습니다.
  const todoItem = target.closest(".todo-item");
  // 빈 목록 메시지(.empty-message) 등은 .todo-item이 아니므로 여기서 종료합니다.
  if (!todoItem) {
    return;
  }
  // data-todo-id는 HTML에서는 data-todo-id, JS에서는 dataset.todoId로 읽습니다.
  const todoId = Number(todoItem.dataset.todoId);
  // 숫자로 바꿨는데 NaN이면 잘못된 데이터이므로 안전하게 무시합니다.
  if (Number.isNaN(todoId)) {
    return;
  }
  // 클릭 지점에서 위로 올라가며 .delete-button 조상이 있는지 확인합니다(버튼 자체를 눌렀을 때도 자기 자신을 반환합니다).
  const deleteButton = target.closest(".delete-button");
  // 삭제 버튼(또는 그 안쪽)을 눌렀다면 삭제 로직을 실행합니다.
  if (deleteButton) {
    deleteTodo(todoId);
    return;
  }
  // 같은 방식으로 수정 버튼 영역인지 확인합니다.
  const editButton = target.closest(".edit-button");
  // 수정 버튼(또는 그 안쪽)을 눌렀다면 수정 로직을 실행합니다.
  if (editButton) {
    editTodo(todoId);
    return;
  }
  // 체크박스·텍스트 등 다른 부분을 눌렀다면 이 핸들러에서는 아무 것도 하지 않습니다.
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
// 자식 li가 바뀌어도 이 리스너 하나로 삭제·수정 클릭을 모두 처리합니다.
todoList.addEventListener("click", handleTodoListClick);
// 글자가 한 글자라도 바뀌면(입력·삭제·붙여넣기) 에러 표시를 즉시 걷습니다.
todoInput.addEventListener("input", () => {
  clearTodoInputError();
});
// 흔들림이 끝나면 .shake만 정리합니다(문구는 사용자가 입력할 때까지 유지하지 않도록 input에서 처리).
todoInput.addEventListener("animationend", handleTodoInputShakeEnd);
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
