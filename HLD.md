# High-Level Design (HLD): School CRM v23

## 1. System Architecture
School CRM v23 follows a modern Client-Server architecture. The application is divided into a React-based frontend and a Node.js-based backend, communicating primarily via REST APIs and WebSockets for real-time features.

## 2. Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Radix UI, Framer Motion, React Query, React Router DOM.
- **Backend:** Node.js, Express.js.
- **Database:** Relational Database (PostgreSQL) for structured academic data.
- **Real-time:** Socket.io (or similar WebSocket technology) for chat and live notifications.
- **Storage:** AWS S3 (or similar) for file uploads (assignments, profile pictures).

## 3. High-Level Components

### 3.1 Frontend Architecture
- **UI Components:** Reusable, accessible components (standardized via a library like shadcn/ui).
- **State Management:** 
  - `React Query` for server state (caching, loading, error handling).
  - React Context / Zustand for global client state (e.g., active user, theme).
- **Routing:** URL-based routing using `react-router-dom` with lazy-loaded route components to optimize chunk sizes.

### 3.2 Backend Architecture
- **API Gateway/Controllers:** Handles incoming HTTP requests and WebSocket connections.
- **Service Layer:** Contains the core business logic (e.g., calculating grades, validating attendance).
- **Data Access Layer:** ORM/Query builder (e.g., Prisma or Sequelize) to interact with the database.

## 4. Database Schema Overview
Core entities include:
- **Users:** (ID, Role, Name, Email, PasswordHash)
- **Classes/Courses:** (ID, Name, TeacherID)
- **Subjects:** (ID, Name, Description)
- **Attendance:** (ID, StudentID, ClassID, Date, Status)
- **Grades:** (ID, StudentID, AssignmentID, Score)
- **Assignments:** (ID, ClassID, Title, DueDate, FileURL)
- **Chat_Messages:** (ID, SenderID, ReceiverID, Content, Timestamp)
- **Support_Tickets:** (ID, UserID, Subject, Status, Description)

## 5. Deployment Strategy
- **Frontend:** Deployed to a CDN/Edge network like Vercel.
- **Backend:** Hosted on a scalable platform like Render, Heroku, or AWS ECS.
- **Database:** Managed database service (e.g., AWS RDS or Supabase).
