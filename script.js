const STORAGE_KEY = 'todoAppTasks';
const THEME_KEY = 'todoAppTheme';
const SYNC_KEY = 'todoAppSyncStatus';
const USER_KEY = 'todoAppUser';
const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };
const DEMO_TASKS = [
  {
    id: 101,
    text: 'Finalize portfolio overview',
    priority: 'high',
    category: 'work',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    reminder: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    recurrence: 'none',
    completed: false,
    status: 'backlog',
    createdAt: Date.now() - 1800000,
    subtasks: [
      { id: 1011, text: 'Polish headline', completed: false },
      { id: 1012, text: 'Review project metrics', completed: true },
    ],
  },
  {
    id: 102,
    text: 'Review recruiter follow-up strategy',
    priority: 'medium',
    category: 'personal',
    dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    reminder: new Date(Date.now() + 172800000).toISOString().slice(0, 16),
    recurrence: 'weekly',
    completed: false,
    status: 'inProgress',
    createdAt: Date.now() - 3600000,
    subtasks: [{ id: 1021, text: 'Draft message', completed: false }],
  },
  {
    id: 103,
    text: 'Practice product demo walkthrough',
    priority: 'high',
    category: 'study',
    dueDate: new Date(Date.now() + 259200000).toISOString().slice(0, 10),
    reminder: new Date(Date.now() + 259200000).toISOString().slice(0, 16),
    recurrence: 'none',
    completed: false,
    status: 'backlog',
    createdAt: Date.now() - 7200000,
    subtasks: [],
  },
];
const BOARD_COLUMNS = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];
let draggedTaskId = null;

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const categoryInput = document.querySelector('#category-input');
const recurrenceInput = document.querySelector('#recurrence-input');
const dueDateInput = document.querySelector('#due-date-input');
const reminderInput = document.querySelector('#reminder-input');
const priorityInput = document.querySelector('#priority-input');
const todoList = document.querySelector('#todo-list');
const taskCounter = document.querySelector('#taskCounter');
const totalTasksEl = document.querySelector('#totalTasks');
const completedTasksEl = document.querySelector('#completedTasks');
const remainingTasksEl = document.querySelector('#remainingTasks');
const clearCompletedBtn = document.querySelector('#clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');
const template = document.querySelector('#todo-item-template');
const themeToggleBtn = document.querySelector('#themeToggle');
const searchInput = document.querySelector('#searchInput');
const sortInput = document.querySelector('#sortInput');
const toastContainer = document.querySelector('#toastContainer');
const syncBtn = document.querySelector('#syncBtn');
const exportBtn = document.querySelector('#exportBtn');
const importInput = document.querySelector('#importInput');
const boardColumns = document.querySelector('#boardColumns');
const completionRateEl = document.querySelector('#completionRate');
const progressFill = document.querySelector('#progressFill');
const categoryBreakdown = document.querySelector('#categoryBreakdown');
const insightGrid = document.querySelector('#insightGrid');
const focusBtn = document.querySelector('#focusToggle');
const focusHint = document.querySelector('#focusHint');
const syncStatus = document.querySelector('#syncStatus');
const userNameInput = document.querySelector('#userNameInput');
const quickPills = document.querySelectorAll('.quick-pill');

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

const savedUser = localStorage.getItem(USER_KEY);
const savedSyncStatus = localStorage.getItem(SYNC_KEY);

const state = {
  todos: loadTodos(),
  filter: 'all',
  searchQuery: '',
  sortBy: 'newest',
  focusMode: false,
  currentUser: savedUser && savedUser !== 'Recruiter Demo' ? savedUser : 'My Workspace',
  syncStatus: savedSyncStatus && savedSyncStatus !== 'Synced locally' ? savedSyncStatus : 'Saved locally',
};

function setSyncStatus(message) {
  state.syncStatus = message;
  if (syncStatus) {
    syncStatus.textContent = message;
  }
  localStorage.setItem(SYNC_KEY, message);
}

function initUser() {
  if (userNameInput) {
    userNameInput.value = state.currentUser;
  }
}

function showToast(message, type = 'success') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function normalizeTodo(todo) {
  const text = String(todo?.text || '').trim();
  if (!text) return null;

  const status = ['backlog', 'inProgress', 'done'].includes(todo?.status) ? todo.status : todo?.completed ? 'done' : 'backlog';
  const recurrence = ['none', 'daily', 'weekly', 'monthly'].includes(todo?.recurrence) ? todo.recurrence : 'none';

  return {
    id: Number(todo.id) || Date.now() + Math.random(),
    text,
    priority: ['high', 'medium', 'low'].includes(todo.priority) ? todo.priority : 'medium',
    category: ['work', 'personal', 'study'].includes(todo.category) ? todo.category : 'personal',
    dueDate: typeof todo.dueDate === 'string' ? todo.dueDate : '',
    reminder: typeof todo.reminder === 'string' ? todo.reminder : '',
    recurrence,
    status,
    completed: status === 'done' || Boolean(todo.completed),
    createdAt: Number(todo.createdAt) || Date.now(),
    subtasks: Array.isArray(todo.subtasks)
      ? todo.subtasks
          .map((subtask) => ({
            id: Number(subtask.id) || Date.now() + Math.random(),
            text: String(subtask.text || '').trim(),
            completed: Boolean(subtask.completed),
          }))
          .filter((subtask) => subtask.text)
      : [],
  };
}

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(savedTodos) && savedTodos.length) {
      return savedTodos.map(normalizeTodo).filter(Boolean);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_TASKS));
    return DEMO_TASKS.map(normalizeTodo).filter(Boolean);
  } catch (error) {
    console.error('Failed to load todos:', error);
    return DEMO_TASKS.map(normalizeTodo).filter(Boolean);
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function updateCounter() {
  const remaining = state.todos.filter((todo) => !todo.completed).length;
  const total = state.todos.length;
  const label = remaining === 1 ? '1 task left' : `${remaining} tasks left`;
  taskCounter.textContent = total === 0 ? '0 tasks' : label;
}

function updateSummary() {
  const total = state.todos.length;
  const completed = state.todos.filter((todo) => todo.completed || todo.status === 'done').length;
  const remaining = Math.max(total - completed, 0);
  const highPriority = state.todos.filter((todo) => todo.priority === 'high').length;
  const upcoming = state.todos.filter((todo) => todo.dueDate && !todo.completed && todo.status !== 'done').length;
  const focusValue = total ? Math.round((completed / total) * 100) : 0;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  remainingTasksEl.textContent = remaining;

  completionRateEl.textContent = `${focusValue}%`;
  progressFill.style.width = `${focusValue}%`;

  const label = remaining === 1 ? '1 task left' : `${remaining} tasks left`;
  taskCounter.textContent = total === 0 ? '0 tasks' : label;

  const categories = {};
  state.todos.forEach((todo) => {
    categories[todo.category] = (categories[todo.category] || 0) + 1;
  });

  categoryBreakdown.innerHTML = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => {
      const width = Math.max((count / Math.max(total, 1)) * 100, 12);
      return `
        <div class="category-row">
          <div class="category-label-wrap">
            <span class="dot ${category}"></span>
            <span>${category}</span>
          </div>
          <div class="category-progress">
            <span style="width: ${width}%"></span>
          </div>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join('');

  if (!categoryBreakdown.innerHTML.trim()) {
    categoryBreakdown.innerHTML = '<div class="empty-mini">No categories yet</div>';
  }

  const todayCount = state.todos.filter((todo) => todo.dueDate === new Date().toISOString().slice(0, 10)).length;
  const completedThisWeek = state.todos.filter((todo) => {
    if (!todo.completed && todo.status !== 'done') return false;
    const created = new Date(todo.createdAt);
    const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  const insightCards = [
    {
      label: 'Focus score',
      value: `${focusValue}%`,
      note: focusValue >= 75 ? 'Excellent momentum' : focusValue >= 40 ? 'Steady progress' : 'Needs attention',
    },
    {
      label: 'High priority',
      value: highPriority,
      note: highPriority > 0 ? 'Critical tasks' : 'Low risk',
    },
    {
      label: 'Due today',
      value: todayCount,
      note: todayCount > 0 ? 'Time-sensitive' : 'Clear schedule',
    },
    {
      label: 'Completed this week',
      value: completedThisWeek,
      note: completedThisWeek > 0 ? 'Strong execution' : 'Start with a quick win',
    },
  ];

  if (insightGrid) {
    insightGrid.innerHTML = insightCards
      .map(
        (item) => `
          <article class="insight-card">
            <span class="insight-label">${item.label}</span>
            <strong class="insight-value">${item.value}</strong>
            <span class="insight-note">${item.note}</span>
          </article>
        `
      )
      .join('');
  }

  const goalText = total === 0 ? 'Start by adding your first task.' : remaining === 0 ? 'Everything is complete — nice work.' : `You have ${remaining} task${remaining === 1 ? '' : 's'} left to finish this cycle.`;
  taskCounter.setAttribute('title', goalText);
}

function getVisibleTodos() {
  let result = [...state.todos];

  if (state.focusMode) {
    const today = new Date().toISOString().slice(0, 10);
    result = result.filter((todo) => {
      const isOpen = !todo.completed && todo.status !== 'done';
      const matchesToday = !todo.dueDate || todo.dueDate === today || new Date(todo.dueDate) <= new Date(`${today}T23:59:59`);
      return isOpen && matchesToday;
    });
  }

  switch (state.filter) {
    case 'active':
      result = result.filter((todo) => !todo.completed && todo.status !== 'done');
      break;
    case 'completed':
      result = result.filter((todo) => todo.completed || todo.status === 'done');
      break;
    case 'high':
      result = result.filter((todo) => todo.priority === 'high');
      break;
    default:
      break;
  }

  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase();
    result = result.filter((todo) => todo.text.toLowerCase().includes(query));
  }

  switch (state.sortBy) {
    case 'oldest':
      result.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case 'priority':
      result.sort((a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0));
      break;
    case 'dueSoon':
      result.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      break;
    case 'newest':
    default:
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;
  }

  return result;
}

function formatDueDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function formatReminder(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getTaskStatus(task) {
  if (task.status === 'done' || task.completed) return 'done';
  if (task.status === 'inProgress') return 'inProgress';
  return 'backlog';
}

function isOverdue(todo) {
  if (!todo.dueDate || todo.completed || todo.status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate.includes('T') ? todo.dueDate : `${todo.dueDate}T00:00:00`);
  return due < today;
}

function addRecurrence(dateString, recurrence) {
  if (!dateString || recurrence === 'none') return dateString;
  const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
  const next = new Date(date);

  if (recurrence === 'daily') {
    next.setDate(next.getDate() + 1);
  } else if (recurrence === 'weekly') {
    next.setDate(next.getDate() + 7);
  } else if (recurrence === 'monthly') {
    next.setMonth(next.getMonth() + 1);
  }

  return next.toISOString().slice(0, 16);
}

function renderBoard() {
  if (!boardColumns) return;
  const visibleTasks = getVisibleTodos();
  boardColumns.innerHTML = '';

  if (state.focusMode) {
    boardColumns.innerHTML = '<div class="board-empty">Focus mode keeps only today\'s active tasks visible.</div>';
    return;
  }

  BOARD_COLUMNS.forEach((column) => {
    const columnEl = document.createElement('div');
    columnEl.className = 'board-column';

    const tasks = visibleTasks.filter((todo) => getTaskStatus(todo) === column.key);

    const header = document.createElement('div');
    header.className = 'board-column-header';
    header.innerHTML = `<h3>${column.label}</h3><span>${tasks.length}</span>`;

    const list = document.createElement('div');
    list.className = 'board-task-list';

    if (!tasks.length) {
      const empty = document.createElement('div');
      empty.className = 'board-empty';
      empty.textContent = 'No tasks';
      list.appendChild(empty);
    } else {
      tasks.forEach((task) => {
        const boardTask = document.createElement('div');
        boardTask.className = 'board-task';
        boardTask.draggable = true;
        boardTask.dataset.id = String(task.id);
        boardTask.innerHTML = `
          <div class="board-task-header">
            <strong>${task.text}</strong>
            <span class="priority-badge priority-${task.priority || 'medium'}">${task.priority}</span>
          </div>
          <div class="board-task-meta">
            <span>${task.category}</span>
            <span>${task.dueDate ? formatDueDate(task.dueDate) : 'No date'}</span>
          </div>
        `;

        boardTask.addEventListener('dragstart', () => {
          draggedTaskId = task.id;
          boardTask.classList.add('dragging');
        });

        boardTask.addEventListener('dragend', () => {
          boardTask.classList.remove('dragging');
          draggedTaskId = null;
        });

        boardTask.addEventListener('dragover', (event) => {
          event.preventDefault();
        });

        boardTask.addEventListener('drop', (event) => {
          event.preventDefault();
          if (draggedTaskId && draggedTaskId !== task.id) {
            moveTaskToStatus(draggedTaskId, column.key);
          }
        });

        list.appendChild(boardTask);
      });
    }

    columnEl.appendChild(header);
    columnEl.appendChild(list);
    boardColumns.appendChild(columnEl);
  });
}

function renderTodos() {
  const visibleTodos = getVisibleTodos();
  todoList.innerHTML = '';

  if (focusBtn) {
    focusBtn.textContent = state.focusMode ? 'Focus mode on' : 'Focus mode off';
    focusBtn.classList.toggle('active', state.focusMode);
  }

  if (focusHint) {
    focusHint.textContent = state.focusMode ? 'Showing today\'s priority tasks' : 'Showing all tasks';
  }

  if (!visibleTodos.length) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    const message = state.focusMode
      ? 'No active tasks for today. Add one or turn focus mode off.'
      : state.searchQuery
        ? 'No tasks match your search.'
        : 'No tasks match this view yet.';
    emptyState.textContent = message;
    todoList.appendChild(emptyState);
    updateSummary();
    renderBoard();
    return;
  }

  visibleTodos.forEach((todo) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector('.task-toggle');
    const text = item.querySelector('.task-text');
    const editInput = item.querySelector('.task-edit-input');
    const priorityBadge = item.querySelector('.priority-badge');
    const categoryBadge = item.querySelector('.category-badge');
    const dueDateBadge = item.querySelector('.due-date');
    const recurrenceBadge = item.querySelector('.recurrence-badge');
    const reminderBadge = item.querySelector('.reminder-badge');
    const subtaskList = item.querySelector('.subtask-list');
    const subtaskInput = item.querySelector('.subtask-input');
    const subtaskAddBtn = item.querySelector('.subtask-add-btn');
    const editBtn = item.querySelector('.edit-btn');
    const deleteBtn = item.querySelector('.delete-btn');

    item.dataset.id = String(todo.id);
    item.draggable = true;
    checkbox.checked = todo.completed || todo.status === 'done';
    text.textContent = todo.text;
    editInput.value = todo.text;

    const priority = todo.priority || 'medium';
    priorityBadge.textContent = priority;
    priorityBadge.classList.add(`priority-${priority}`);

    const category = todo.category || 'personal';
    categoryBadge.textContent = category;
    categoryBadge.classList.add(`category-${category}`);

    dueDateBadge.textContent = formatDueDate(todo.dueDate);
    if (!todo.dueDate) {
      dueDateBadge.style.display = 'none';
    } else if (isOverdue(todo)) {
      dueDateBadge.classList.add('overdue');
    }

    const recurrenceText = todo.recurrence === 'none' ? 'One-time' : todo.recurrence;
    recurrenceBadge.textContent = recurrenceText;
    recurrenceBadge.classList.add(`recurrence-${todo.recurrence || 'none'}`);

    if (todo.reminder) {
      reminderBadge.textContent = formatReminder(todo.reminder);
    } else {
      reminderBadge.style.display = 'none';
    }

    if (todo.subtasks.length) {
      todo.subtasks.forEach((subtask) => {
        const subtaskItem = document.createElement('label');
        subtaskItem.className = `subtask-item ${subtask.completed ? 'completed' : ''}`;

        const subtaskCheckbox = document.createElement('input');
        subtaskCheckbox.type = 'checkbox';
        subtaskCheckbox.checked = subtask.completed;
        subtaskCheckbox.addEventListener('change', () => toggleSubtask(todo.id, subtask.id));

        const subtaskText = document.createElement('span');
        subtaskText.className = 'subtask-text';
        subtaskText.textContent = subtask.text;

        subtaskItem.appendChild(subtaskCheckbox);
        subtaskItem.appendChild(subtaskText);
        subtaskList.appendChild(subtaskItem);
      });
    }

    item.classList.toggle('completed', todo.completed || todo.status === 'done');

    checkbox.addEventListener('change', () => {
      toggleTodo(todo.id);
    });

    item.addEventListener('dragstart', () => {
      draggedTaskId = todo.id;
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      draggedTaskId = null;
    });

    item.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    item.addEventListener('drop', (event) => {
      event.preventDefault();
      if (draggedTaskId && draggedTaskId !== todo.id) {
        moveTaskToStatus(draggedTaskId, getClosestDropStatus(todo));
      }
    });

    subtaskAddBtn.addEventListener('click', () => {
      addSubtask(todo.id, subtaskInput.value);
    });

    subtaskInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        addSubtask(todo.id, subtaskInput.value);
      }
    });

    let isEditing = false;
    editBtn.addEventListener('click', () => {
      if (!isEditing) {
        isEditing = true;
        text.style.display = 'none';
        editInput.style.display = 'block';
        editInput.focus();
        editInput.select();
        editBtn.textContent = 'Save';
        return;
      }
      saveEdit(todo.id, editInput.value);
    });

    editInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        saveEdit(todo.id, editInput.value);
      } else if (event.key === 'Escape') {
        cancelEdit();
      }
    });

    function cancelEdit() {
      isEditing = false;
      editInput.value = todo.text;
      text.style.display = 'block';
      editInput.style.display = 'none';
      editBtn.textContent = 'Edit';
    }

    function saveEdit(id, newText) {
      const trimmed = newText.trim();
      if (!trimmed) {
        showToast('Task cannot be empty', 'error');
        editInput.focus();
        return;
      }

      updateTodoText(id, trimmed);
      isEditing = false;
      text.style.display = 'block';
      editInput.style.display = 'none';
      editBtn.textContent = 'Edit';
      showToast('Task updated successfully');
    }

    deleteBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    todoList.appendChild(item);
  });

  updateSummary();
  renderBoard();
}

function getClosestDropStatus(task) {
  const currentStatus = getTaskStatus(task);
  if (currentStatus === 'done') return 'done';
  if (currentStatus === 'inProgress') return 'inProgress';
  return 'backlog';
}

function moveTaskToStatus(id, status) {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== id) return todo;
    const isDone = status === 'done';
    return {
      ...todo,
      status,
      completed: isDone,
    };
  });
  saveTodos();
  renderTodos();
  showToast('Task moved');
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== id) return todo;

    const nextCompleted = !todo.completed;

    if (nextCompleted && todo.recurrence !== 'none') {
      return {
        ...todo,
        completed: false,
        status: 'backlog',
        dueDate: addRecurrence(todo.dueDate || new Date().toISOString().slice(0, 10), todo.recurrence),
        createdAt: Date.now(),
      };
    }

    return {
      ...todo,
      completed: nextCompleted,
      status: nextCompleted ? 'done' : 'backlog',
    };
  });

  saveTodos();
  renderTodos();
  showToast('Task status updated');
}

function toggleSubtask(todoId, subtaskId) {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== todoId) return todo;
    return {
      ...todo,
      subtasks: todo.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      ),
    };
  });
  saveTodos();
  renderTodos();
}

function addSubtask(todoId, value) {
  const trimmed = value.trim();
  if (!trimmed) {
    showToast('Subtask cannot be empty', 'error');
    return;
  }

  state.todos = state.todos.map((todo) =>
    todo.id === todoId
      ? {
          ...todo,
          subtasks: [...todo.subtasks, { id: Date.now(), text: trimmed, completed: false }],
        }
      : todo
  );

  saveTodos();
  renderTodos();
}

function updateTodoText(id, newText) {
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, text: newText } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
  showToast('Task deleted', 'error');
}

function addTodo(text, priority, category, recurrence, dueDate, reminder) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    todoInput.focus();
    showToast('Please enter a task', 'error');
    return;
  }

  const newTask = {
    id: Date.now(),
    text: trimmedText,
    priority,
    category,
    recurrence,
    dueDate,
    reminder,
    completed: false,
    status: 'backlog',
    createdAt: Date.now(),
    subtasks: [],
  };

  state.todos = [newTask, ...state.todos];
  saveTodos();
  renderTodos();
  showToast('Task added successfully');

  if (state.focusMode && !dueDate) {
    const today = new Date().toISOString().slice(0, 10);
    state.todos = state.todos.map((todo) => (todo.id === newTask.id ? { ...todo, dueDate: today } : todo));
    saveTodos();
    renderTodos();
  }

  if (reminder) {
    const reminderTime = new Date(reminder).getTime();
    if (!Number.isNaN(reminderTime)) {
      const delay = reminderTime - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          showToast(`Reminder: ${trimmedText}`, 'success');
        }, Math.min(delay, 2147483647));
      }
    }
  }
}

function clearCompleted() {
  const completedCount = state.todos.filter((todo) => todo.completed || todo.status === 'done').length;
  if (completedCount === 0) {
    showToast('No completed tasks to clear', 'error');
    return;
  }

  state.todos = state.todos.filter((todo) => !(todo.completed || todo.status === 'done'));
  saveTodos();
  renderTodos();
  showToast('Completed tasks cleared');
}

function toggleFocusMode() {
  state.focusMode = !state.focusMode;
  renderTodos();
  showToast(state.focusMode ? 'Focus mode enabled' : 'Focus mode disabled');
}

function quickAddTask(taskText) {
  const quickValue = taskText.trim();
  if (!quickValue) return;
  addTodo(quickValue, 'medium', 'work', 'none', new Date().toISOString().slice(0, 10), '');
}

function setFilter(filter) {
  state.filter = filter;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
  renderTodos();
}

function exportTasks() {
  const blob = new Blob([JSON.stringify(state.todos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'todo-export.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast('Tasks exported');
}

function importTasks(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result || '[]');
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid data');
      }
      state.todos = parsed.map(normalizeTodo).filter(Boolean);
      saveTodos();
      renderTodos();
      setSyncStatus('Imported from file');
      showToast('Tasks imported');
    } catch (error) {
      console.error(error);
      showToast('Invalid import file', 'error');
    }
  };
  reader.readAsText(file);
}

function syncDemoCloud() {
  const name = userNameInput.value.trim() || 'My Workspace';
  state.currentUser = name;
  localStorage.setItem(USER_KEY, name);
  if (userNameInput) {
    userNameInput.value = name;
  }
  setSyncStatus('Saved locally');
  showToast('Workspace saved locally');
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(
    todoInput.value,
    priorityInput.value,
    categoryInput.value,
    recurrenceInput.value,
    dueDateInput.value,
    reminderInput.value
  );
  todoInput.value = '';
  categoryInput.value = 'personal';
  recurrenceInput.value = 'none';
  dueDateInput.value = '';
  reminderInput.value = '';
  priorityInput.value = 'medium';
  todoInput.focus();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    state.searchQuery = event.target.value;
    renderTodos();
  });
}

if (sortInput) {
  sortInput.addEventListener('change', (event) => {
    state.sortBy = event.target.value;
    renderTodos();
  });
}

if (focusBtn) {
  focusBtn.addEventListener('click', toggleFocusMode);
}

if (syncBtn) {
  syncBtn.addEventListener('click', syncDemoCloud);
}

if (exportBtn) {
  exportBtn.addEventListener('click', exportTasks);
}

quickPills.forEach((button) => {
  button.addEventListener('click', () => {
    quickAddTask(button.dataset.quickTask || '');
    todoInput.focus();
  });
});

if (importInput) {
  importInput.addEventListener('change', (event) => {
    if (event.target.files && event.target.files[0]) {
      importTasks(event.target.files[0]);
      event.target.value = '';
    }
  });
}

if (userNameInput) {
  userNameInput.addEventListener('change', (event) => {
    const cleaned = event.target.value.trim() || 'My Workspace';
    state.currentUser = cleaned;
    localStorage.setItem(USER_KEY, cleaned);
    setSyncStatus('Workspace updated');
  });
}

initTheme();
initUser();
setSyncStatus(state.syncStatus);
renderTodos();
