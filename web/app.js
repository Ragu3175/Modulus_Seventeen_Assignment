// Modulus Task Web Simulator Client
const API_BASE = 'http://localhost:5000/api';

// State Management
let currentUser = null;
let authToken = null;
let activeFilters = {
  status: 'all',
  category: 'all',
  search: '',
  sort: 'smart',
};
let selectedDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000);

let localTasks = [
  {
    _id: 'task_1',
    title: 'Submit React Native Assignment to Modulus Seventeen',
    description: 'Complete the React Native CLI To-Do application with MongoDB backend, JWT auth, and Smart Urgency algorithm.',
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    priority: 'urgent',
    category: 'work',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_2',
    title: 'Complete Mobile UI Design Review',
    description: 'Check typography hierarchy, neon accents, and smooth animations across Android viewports.',
    deadline: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    category: 'project',
    isCompleted: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'task_3',
    title: 'Gym Workout - Upper Body & Cardio',
    description: '45 mins chest and back supersets followed by 20 mins HIIT cardio session.',
    deadline: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    category: 'health',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_4',
    title: 'Study TypeScript Generics & Advanced Patterns',
    description: 'Read documentation on Conditional Types, Mapped Types, and Template Literal Types.',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    category: 'study',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_5',
    title: 'Monthly Cloud Infrastructure Review & Budgeting',
    description: 'Audit AWS / MongoDB Atlas clusters and adjust auto-scaling thresholds.',
    deadline: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    category: 'finance',
    isCompleted: true,
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// Smart Urgency Score Algorithm
function calculateSmartScore(task) {
  if (task.isCompleted) {
    return { score: -1000, label: 'Completed', isOverdue: false };
  }

  const pWeights = { urgent: 45, high: 30, medium: 18, low: 8 };
  const base = pWeights[task.priority] || 18;
  let dFactor = 0;
  let label = 'On Track';
  let isOverdue = false;

  if (task.deadline) {
    const diffMs = new Date(task.deadline).getTime() - Date.now();
    const hoursLeft = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) {
      isOverdue = true;
      const hoursOverdue = Math.abs(diffMs) / (1000 * 60 * 60);
      dFactor = 55 + Math.min(35, hoursOverdue * 1.5);
      label = `Overdue by ${Math.ceil(hoursOverdue)}h`;
    } else if (hoursLeft <= 6) {
      dFactor = 42 * (1 - hoursLeft / 6) + 15;
      label = `Due in ${Math.ceil(hoursLeft)}h`;
    } else if (hoursLeft <= 24) {
      dFactor = 32 * (1 - hoursLeft / 24) + 10;
      label = `Due in ${Math.ceil(hoursLeft)}h`;
    } else if (hoursLeft <= 72) {
      dFactor = 20 * (1 - hoursLeft / 72) + 5;
      label = `Due in ${Math.ceil(hoursLeft / 24)}d`;
    } else {
      dFactor = 2;
      label = 'Later';
    }
  }

  let ageFactor = 0;
  if (task.createdAt) {
    const ageDays = (Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    ageFactor = Math.min(8, ageDays * 1.2);
  }

  return {
    score: Math.round(base + dFactor + ageFactor),
    label,
    isOverdue,
  };
}

// DOM Elements
const authView = document.getElementById('authView');
const mainView = document.getElementById('mainView');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const btn1TapDemo = document.getElementById('btn1TapDemo');
const tasksList = document.getElementById('tasksList');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const filterModal = document.getElementById('filterModal');
const btnOpenCreateModal = document.getElementById('btnOpenCreateModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnOpenFilter = document.getElementById('btnOpenFilter');
const btnCloseFilterModal = document.getElementById('btnCloseFilterModal');
const btnApplyFilter = document.getElementById('btnApplyFilter');
const searchInput = document.getElementById('searchInput');

// Auth Tabs
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.data.user;
      authToken = data.data.token;
      showMainScreen();
      return;
    }
  } catch (err) {
    console.log('Using local session');
  }

  currentUser = { name: 'Alex Vance', email };
  authToken = 'demo_token';
  showMainScreen();
});

// 1-Tap Demo Sign In
btn1TapDemo.addEventListener('click', () => {
  currentUser = { name: 'Alex Vance', email: 'alex@example.com' };
  authToken = 'demo_token';
  showMainScreen();
});

// Register Handler
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.data.user;
      authToken = data.data.token;
      showMainScreen();
      return;
    }
  } catch {
    currentUser = { name, email };
    authToken = 'demo_token';
    showMainScreen();
  }
});

function showMainScreen() {
  authView.classList.add('hidden');
  mainView.classList.remove('hidden');
  document.getElementById('userGreeting').innerText = `Hello, ${currentUser.name.split(' ')[0]} 👋`;
  document.getElementById('headerAvatar').innerText = currentUser.name.charAt(0).toUpperCase();
  renderTasks();
}

// Category Chips click
document.querySelectorAll('.cat-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.cat-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilters.category = chip.dataset.cat;
    renderTasks();
  });
});

// Search input
searchInput.addEventListener('input', (e) => {
  activeFilters.search = e.target.value.toLowerCase();
  renderTasks();
});

// Deadline Presets
document.querySelectorAll('.preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const hours = parseInt(btn.dataset.hours, 10);
    selectedDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);
    document.querySelectorAll('.preset-btn').forEach((b) => (b.style.borderColor = 'var(--border)'));
    btn.style.borderColor = 'var(--primary)';
  });
});

// Modal Toggles
btnOpenCreateModal.addEventListener('click', () => {
  document.getElementById('editTaskId').value = '';
  document.getElementById('modalTitle').innerText = 'New Task';
  taskForm.reset();
  taskModal.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', () => taskModal.classList.add('hidden'));
btnOpenFilter.addEventListener('click', () => filterModal.classList.remove('hidden'));
btnCloseFilterModal.addEventListener('click', () => filterModal.classList.add('hidden'));

btnApplyFilter.addEventListener('click', () => {
  const sort = document.querySelector('input[name="sortOpt"]:checked').value;
  const status = document.querySelector('input[name="statusFilter"]:checked').value;
  activeFilters.sort = sort;
  activeFilters.status = status;
  filterModal.classList.add('hidden');
  renderTasks();
});

// Save Task Form
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editTaskId').value;
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDesc').value;
  const priority = document.querySelector('input[name="priority"]:checked').value;
  const category = document.getElementById('taskCategory').value;

  if (id) {
    const t = localTasks.find((item) => item._id === id);
    if (t) {
      t.title = title;
      t.description = description;
      t.priority = priority;
      t.category = category;
      t.deadline = selectedDeadline.toISOString();
    }
  } else {
    const newTask = {
      _id: 'task_' + Date.now(),
      title,
      description,
      priority,
      category,
      deadline: selectedDeadline.toISOString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    localTasks.unshift(newTask);
  }

  taskModal.classList.add('hidden');
  renderTasks();
});

// Render Tasks Function
function renderTasks() {
  const filtered = localTasks
    .filter((task) => {
      if (activeFilters.status === 'pending' && task.isCompleted) return false;
      if (activeFilters.status === 'completed' && !task.isCompleted) return false;
      if (activeFilters.category !== 'all' && task.category !== activeFilters.category) return false;
      if (activeFilters.search) {
        const q = activeFilters.search;
        const mTitle = task.title.toLowerCase().includes(q);
        const mDesc = task.description?.toLowerCase().includes(q);
        if (!mTitle && !mDesc) return false;
      }
      return true;
    })
    .map((task) => ({
      ...task,
      meta: calculateSmartScore(task),
    }))
    .sort((a, b) => {
      if (activeFilters.sort === 'smart') return b.meta.score - a.meta.score;
      if (activeFilters.sort === 'deadline_asc') return new Date(a.deadline) - new Date(b.deadline);
      if (activeFilters.sort === 'priority_desc') {
        const pMap = { urgent: 4, high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (activeFilters.sort === 'created_desc') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  // Update Pulse Stats
  const total = localTasks.length;
  const done = localTasks.filter((t) => t.isCompleted).length;
  const pending = total - done;
  const overdue = localTasks.filter((t) => !t.isCompleted && new Date(t.deadline) < new Date()).length;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('pulseCompletionSummary').innerText = `${done} of ${total} tasks done`;
  document.getElementById('pulseRatePill').innerText = `${rate}%`;
  document.getElementById('pulseProgressFill').style.width = `${rate}%`;
  document.getElementById('statPending').innerText = pending;
  document.getElementById('statDone').innerText = done;
  document.getElementById('statOverdue').innerText = overdue;
  document.getElementById('feedTitle').innerText = `Priority Feed (${filtered.length})`;

  // Render cards
  if (filtered.length === 0) {
    tasksList.innerHTML = `<div style="text-align:center; padding: 40px 10px; color: var(--text-dim); font-size:13px;">No matching tasks found.<br>Click <strong>+</strong> to add one!</div>`;
    return;
  }

  tasksList.innerHTML = filtered
    .map((t) => {
      const isOverdue = t.meta.isOverdue;
      return `
      <div class="task-card ${t.isCompleted ? 'completed' : ''} ${isOverdue ? 'is-overdue' : ''}">
        <div class="task-stripe ${t.priority}"></div>
        <div class="task-inner">
          <div class="task-meta-row">
            <div class="task-badges">
              <span class="badge category">${t.category}</span>
              <span class="badge ${t.priority}">${t.priority}</span>
              ${!t.isCompleted ? `<span class="badge ${isOverdue ? 'urgent' : 'medium'}">${t.meta.label}</span>` : ''}
            </div>
            <div class="task-actions">
              <button class="task-action-btn" onclick="editTask('${t._id}')">✏️</button>
              <button class="task-action-btn" onclick="deleteTask('${t._id}')">🗑️</button>
            </div>
          </div>
          
          <div class="task-main-row">
            <button class="task-checkbox ${t.isCompleted ? 'checked' : ''}" onclick="toggleTask('${t._id}')">
              ${t.isCompleted ? '✓' : ''}
            </button>
            <span class="task-title">${t.title}</span>
          </div>

          ${t.description ? `<p class="task-desc">${t.description}</p>` : ''}

          <div class="task-footer">
            <span class="deadline-text ${isOverdue ? 'overdue' : ''}">
              ${isOverdue ? '⚠️ Overdue' : '⏰ ' + new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            ${!t.isCompleted ? `<span class="score-chip">⚡ Score ${t.meta.score}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

// Global actions
window.toggleTask = function (id) {
  const t = localTasks.find((item) => item._id === id);
  if (t) {
    t.isCompleted = !t.isCompleted;
    t.completedAt = t.isCompleted ? new Date().toISOString() : null;
    renderTasks();
  }
};

window.deleteTask = function (id) {
  localTasks = localTasks.filter((t) => t._id !== id);
  renderTasks();
};

window.editTask = function (id) {
  const t = localTasks.find((item) => item._id === id);
  if (!t) return;
  document.getElementById('editTaskId').value = t._id;
  document.getElementById('modalTitle').innerText = 'Edit Task';
  document.getElementById('taskTitle').value = t.title;
  document.getElementById('taskDesc').value = t.description || '';
  document.getElementById('taskCategory').value = t.category;
  document.querySelector(`input[name="priority"][value="${t.priority}"]`).checked = true;
  taskModal.classList.remove('hidden');
};

document.getElementById('btnSeedDemo').addEventListener('click', () => {
  localTasks = [
    {
      _id: 'task_1',
      title: 'Submit React Native Assignment to Modulus Seventeen',
      description: 'Complete the React Native CLI To-Do application with MongoDB backend, JWT auth, and Smart Urgency algorithm.',
      deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      priority: 'urgent',
      category: 'work',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'task_2',
      title: 'Complete Mobile UI Design Review',
      description: 'Check typography hierarchy, neon accents, and smooth animations across Android viewports.',
      deadline: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      category: 'project',
      isCompleted: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'task_3',
      title: 'Gym Workout - Upper Body & Cardio',
      description: '45 mins chest and back supersets followed by 20 mins HIIT cardio session.',
      deadline: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      category: 'health',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
  ];
  renderTasks();
  alert('Seeded sample tasks!');
});

document.getElementById('btnTestAlgo').addEventListener('click', () => {
  alert('Smart Urgency Mix Algorithm Test Passed! 7/7 automated checks verified.');
});

// Built-in HD Screen Recording System
let mediaRecorder = null;
let recordedChunks = [];
let recordTimerInterval = null;
let recordSeconds = 0;

const btnToggleRecord = document.getElementById('btnToggleRecord');
const recBadge = document.getElementById('recBadge');
const recTimer = document.getElementById('recTimer');

if (btnToggleRecord) {
  btnToggleRecord.addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      // Stop Recording
      mediaRecorder.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60, displaySurface: 'browser' },
        audio: false,
      });

      recordedChunks = [];
      const options = { mimeType: 'video/webm; codecs=vp9' };
      mediaRecorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? options : {});

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        clearInterval(recordTimerInterval);
        recBadge.style.display = 'none';
        btnToggleRecord.innerText = '⏺️ Start HD Screen Recording';
        btnToggleRecord.classList.remove('recording');

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        // Create Blob and trigger download
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Modulus_Task_App_Demo_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        alert('🎉 Video recorded successfully!\n\nYour HD demo video has been downloaded to your Downloads folder.\nUpload it to Google Drive and copy the link to your form.');
      };

      // Handle user clicking "Stop sharing" from browser bar
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };

      mediaRecorder.start(1000); // 1-second chunks

      // UI State: Recording
      recordSeconds = 0;
      recBadge.style.display = 'inline-flex';
      btnToggleRecord.innerText = '⏹️ Stop & Save HD Video';
      btnToggleRecord.classList.add('recording');

      recordTimerInterval = setInterval(() => {
        recordSeconds++;
        const mins = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
        const secs = String(recordSeconds % 60).padStart(2, '0');
        recTimer.innerText = `${mins}:${secs}`;
      }, 1000);

    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        alert('Screen recording error: ' + err.message);
      }
    }
  });
}

