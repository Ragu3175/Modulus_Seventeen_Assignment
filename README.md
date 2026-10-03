# ⚡ Modulus Task - React Native & MongoDB To-Do Suite

> **Assignment Submission for Modulus Seventeen**  
> Full-Stack Mobile To-Do Application with JWT Authentication, MongoDB Database, and the **Smart Urgency & Priority Mix Algorithm**.

---

## 🌟 Highlights & Features Checklist

### ✅ 1. Core Task Requirements
- [x] **User Registration & Login**: Custom JWT authentication with password hashing using `bcryptjs` and session persistence.
- [x] **Task Creation**: Add tasks with **Title, Description, Date-Time, Deadline, and Priority** (Low, Medium, High, Urgent).
- [x] **Task Completion**: Instant toggle completion status with strikethrough styling and timestamp tracking.
- [x] **Task Deletion**: Safe delete with confirmation dialog.
- [x] **Status Filtering**: Filter by All, Pending, and Completed.
- [x] **Node.js + MongoDB Backend**: Enterprise-grade Express + TypeScript REST API with Mongoose schemas and input validation.

### 🚀 2. Bonus Features (All Implemented!)
- [x] **Task Due Dates & Deadlines**: Full date-time scheduling with quick presets (+2h, End of Day, Tomorrow, +3d) and overdue detection.
- [x] **⚡ Smart Urgency & Priority Mix Algorithm**: Mathematically sound dynamic scoring algorithm combining base priority, deadline proximity decay, overdue penalty, and starvation prevention.
- [x] **Task Categories & Tags**: 7 preset categories (💼 Work, 🧘 Personal, 📚 Study, 🏃 Health, 💰 Finance, 🚀 Project, 📌 Other) with custom colors and tag management.
- [x] **Sorting & Filtering**: Filter by Status, Priority, Category, and Sort by Smart Urgency, Nearest Deadline, Priority, or Creation Date.
- [x] **Subtasks / Checklist Builder**: Add, toggle, and delete individual checklist items with real-time progress bars.
- [x] **Productivity Analytics Dashboard**: Completion rate gauge, priority breakdown progress bars, weekly productivity streak, and smart recommendations.
- [x] **Dark Neo-Glassmorphism UI**: High-impact cyber obsidian dark theme with glowing neon accents, smooth animations, and light theme switcher.
- [x] **Interactive Web Simulator**: Live in-browser tester with Android mockup frame for immediate evaluation without needing an emulator booted.

---

## 🏛️ Project Architecture

```
Modulus seventeen/
├── backend/                  # Node.js + Express + TypeScript + MongoDB REST API
│   ├── src/
│   │   ├── config/           # Database connection & lifecycle
│   │   ├── controllers/      # AuthController & TaskController
│   │   ├── middleware/       # JWT Auth protection, ErrorHandler, Zod validation
│   │   ├── models/           # Mongoose User & Task Schemas
│   │   ├── routes/           # REST API routes
│   │   ├── utils/            # Priority Mix Algorithm & Seeder
│   │   ├── validations/      # Zod validation schemas
│   │   ├── tests/            # Automated test suite (7/7 passed)
│   │   └── server.ts         # Express server entrypoint
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                   # React Native CLI (TypeScript) Android & iOS
│   ├── android/              # Full Native Android Project (Gradle, Manifest, Kotlin)
│   ├── src/
│   │   ├── api/              # Axios HTTP client & API services
│   │   ├── components/       # Buttons, Inputs, TaskCards, Badges, Modals, SVG Icons
│   │   ├── navigation/       # React Navigation (Auth Stack, Main Tabs, Modals)
│   │   ├── screens/          # Login, Register, Home, CreateTask, TaskDetail, Analytics, Profile
│   │   ├── store/            # Zustand state stores (AuthStore, TaskStore, ThemeStore)
│   │   ├── theme/            # Obsidian Dark & Clean Light Design Tokens
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Client-side Priority Mix Algorithm & Date Utils
│   ├── App.tsx
│   ├── index.js
│   ├── package.json
│   └── tsconfig.json
│
├── web/                      # Interactive Web Simulator & Evaluator Frame
│   ├── index.html            # Android mockup frame UI
│   ├── style.css             # Obsidian Glassmorphism stylesheets
│   └── app.js                # Live interactive client connected to REST API
│
├── docs/                     # Specifications & Mathematical Documentation
│   ├── algorithm.md          # Smart Priority Mix formula & weights
│   └── api.md                # Full REST API endpoints & schemas
│
└── package.json              # Root workspace management
```

---

## ⚡ The Smart Urgency & Priority Mix Algorithm

The algorithm solves the critical flaw of static sorting by computing a dynamic score $S(t) \in [0, 100+]$ in real-time:

$$\text{Score} = \text{Base Priority Weight} + \text{Deadline Urgency Factor} + \text{Age Starvation Factor} + \text{Subtask Bonus}$$

### Priority Weights:
- **Urgent**: $+45$ pts
- **High**: $+30$ pts
- **Medium**: $+18$ pts
- **Low**: $+8$ pts

### Deadline Urgency Decay:
- **Overdue**: Critical urgency penalty: $+55 + \min(35, |\text{hours overdue}| \times 1.5)$
- **Due $\le 6$ hours**: $+42 \times (1 - \text{hours}/6) + 15$
- **Due $\le 24$ hours**: $+32 \times (1 - \text{hours}/24) + 10$
- **Due $\le 3$ days**: $+20 \times (1 - \text{hours}/72) + 5$
- **Completed**: Fixed at **$-1000$** (sinks to bottom).

📖 *See [docs/algorithm.md](file:///e:/Raguram/ragu/Modulus%20seventeen/docs/algorithm.md) for full mathematical proof and examples.*

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local `mongod` or MongoDB Atlas URI)

### 2. Start Backend API
```bash
# In project root:
cd backend
npm install
npm run test           # Run algorithm verification tests (7/7 pass)
npm run dev            # Starts REST API on http://localhost:5000
```

### 3. Run React Native Android App
```bash
# In project root:
cd mobile
npm install
npm run android        # Builds and deploys onto connected Android device/emulator
```

### 4. Or Preview with Web Simulator
Simply open `web/index.html` in any browser or launch with Live Server. It includes a 1-Tap Demo account login with instant task interaction!

---

## 🧪 Demo Credentials (Pre-seeded)
- **Email**: `alex@example.com`
- **Password**: `password123`

---

## 📬 Contact & Submission
- **Author**: Candidate for Modulus Seventeen
- **Submission Form**: [https://forms.gle/UZZKMsXApTA2H64J9](https://forms.gle/UZZKMsXApTA2H64J9)
- **Email**: `sarfarazahmedkl@modulusseventeen.com`
