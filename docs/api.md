# 📖 Modulus Task - Backend REST API Specification

**Base URL**: `http://localhost:5000/api` (or `http://10.0.2.2:5000/api` in Android Emulator)  
**Authentication**: HTTP Bearer JWT (`Authorization: Bearer <token>`)

---

## 🔐 1. Authentication Endpoints

### `POST /api/auth/register`
Create a new user account.

**Request Body**:
```json
{
  "name": "Alex Vance",
  "email": "alex@example.com",
  "password": "password123"
}
```

**Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "679f234...",
      "name": "Alex Vance",
      "email": "alex@example.com",
      "avatar": "https://...",
      "createdAt": "2026-10-03T11:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `POST /api/auth/login`
Authenticate user with email and password.

**Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "679f234...",
      "name": "Alex Vance",
      "email": "alex@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `GET /api/auth/me`
Retrieve authenticated user profile. Requires Bearer Token.

---

## 📝 2. Tasks Endpoints (Protected)

### `GET /api/tasks`
Fetch tasks for the authenticated user with search, filter, and sorting.

**Query Parameters**:
- `status`: `all` | `pending` | `completed` (default: `all`)
- `priority`: `all` | `low` | `medium` | `high` | `urgent` (default: `all`)
- `category`: `all` | `work` | `personal` | `study` | `health` | `finance` | `project` | `other`
- `search`: string (matches title, description, or tags)
- `sort`: `smart` (Smart Urgency Mix) | `deadline_asc` | `deadline_desc` | `priority_desc` | `created_desc` | `title_asc`
- `page`: number (default: `1`)
- `limit`: number (default: `50`)

**Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "_id": "679f280...",
      "title": "Submit React Native Assignment to Modulus Seventeen",
      "description": "Complete the React Native CLI To-Do application...",
      "priority": "urgent",
      "category": "work",
      "deadline": "2026-10-03T15:00:00.000Z",
      "isCompleted": false,
      "subtasks": [
        { "id": "st-1", "title": "Implement Auth", "isCompleted": true }
      ],
      "smartScoreMeta": {
        "score": 95,
        "urgencyLevel": "CRITICAL",
        "urgencyLabel": "Due in 4h",
        "hoursRemaining": 4,
        "overdue": false
      }
    }
  ]
}
```

---

### `POST /api/tasks`
Create a new task.

**Request Body**:
```json
{
  "title": "Build UI with Dark Glassmorphism",
  "description": "Ensure responsive layout and neon accents",
  "priority": "urgent",
  "category": "work",
  "deadline": "2026-10-04T18:00:00.000Z",
  "dateTime": "2026-10-04T10:00:00.000Z",
  "tags": ["Mobile", "Design"],
  "subtasks": [
    { "id": "1", "title": "Check contrast ratios", "isCompleted": false }
  ],
  "reminderEnabled": true,
  "color": "#6366F1"
}
```

---

### `PATCH /api/tasks/:id`
Update an existing task's fields.

---

### `PATCH /api/tasks/:id/toggle`
Fast toggle completion status (`isCompleted` $\leftrightarrow$ `!isCompleted`).

---

### `DELETE /api/tasks/:id`
Delete a task by ID.

---

### `GET /api/tasks/stats/summary`
Get productivity summary and task breakdown.

**Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "total": 12,
    "completed": 8,
    "pending": 4,
    "overdue": 1,
    "dueToday": 2,
    "completionRate": 67,
    "priorityCounts": {
      "urgent": 1,
      "high": 1,
      "medium": 2,
      "low": 0
    },
    "categoryCounts": {
      "work": 6,
      "health": 3,
      "study": 3
    }
  }
}
```
