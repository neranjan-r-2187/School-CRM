# Low-Level Design (LLD): School CRM v23

## 1. Frontend Component Design

### 1.1 Directory Structure
```text
src/
├── components/
│   ├── ui/          # Generic UI components (buttons, inputs, modals)
│   └── layout/      # Sidebar, Navbar, Page Wrappers
├── features/
│   ├── auth/        # Login forms, Auth context
│   ├── dashboard/   # Dashboard widgets and specific layouts
│   ├── attendance/  # Attendance taking and viewing components
│   └── chat/        # Real-time chat interfaces
├── pages/           # Route-level components (lazy loaded)
├── services/        # API calls (Axios instances)
├── store/           # Global state management
└── utils/           # Helpers, formatters
```

### 1.2 Routing Strategy
Use `react-router-dom` to manage navigation instead of local state:
- `/login` - Authentication page
- `/dashboard` - Base dashboard
  - `/dashboard/home` - Overview
  - `/dashboard/grades` - Grades view
  - `/dashboard/attendance` - Attendance view
  - `/dashboard/timetable` - Schedule view

## 2. API Endpoints (RESTful)

### Auth
- `POST /api/auth/login` - Authenticate and return JWT.
- `POST /api/auth/logout` - Clear session.

### Users
- `GET /api/users/me` - Get current user profile.
- `GET /api/users` - List users (Admin only).

### Attendance
- `GET /api/attendance` - Get attendance records (filtered by class/student).
- `POST /api/attendance` - Submit attendance (Teacher only).

### Assignments
- `GET /api/assignments` - List assignments.
- `POST /api/assignments` - Create assignment.
- `POST /api/assignments/:id/submit` - Submit student work.

## 3. Real-Time Chat (WebSockets)
- **Event `join`:** User connects and joins their specific room (User ID).
- **Event `send_message`:** Client sends a message payload `{ to, content }`.
- **Event `receive_message`:** Server broadcasts to the recipient's room.

## 4. Database Models (Example: Prisma Schema)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(STUDENT)
  profile   Profile?
  messagesSent     Message[] @relation("SentMessages")
  messagesReceived Message[] @relation("ReceivedMessages")
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
  PARENT
}

model Attendance {
  id        String   @id @default(uuid())
  studentId String
  classId   String
  date      DateTime
  status    AttendanceStatus
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
}
```

## 5. Security & Error Handling
- **JWT Middleware:** Verifies token on all protected `/api/*` routes.
- **RBAC Middleware:** Checks if `req.user.role` has permissions for the endpoint.
- **Error Boundary:** React Error Boundaries catch UI crashes and display a fallback UI.
- **Global Error Handler:** Express middleware to format and return standardized JSON error responses.
