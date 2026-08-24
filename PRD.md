# Product Requirements Document (PRD): School CRM v23

## 1. Introduction
School CRM v23 is a comprehensive School Management System designed to streamline academic life. It provides an intuitive, high-performance interface for managing day-to-day school activities, augmented by modern AI capabilities.

## 2. Target Audience
- **Administrators:** Manage users, system settings, and oversee all school activities.
- **Teachers:** Manage classes, take attendance, grade students, and create assignments.
- **Students:** View grades, track attendance, submit assignments.
- **Parents:** Monitor progress and pay school fees via **Payment gateway integration** (e.g., Stripe).

## 3. Key Features & Concepts Applied

### 3.1 Authentication & Security
- Secure **OAuth / 3rd-party login** and standard email login.
- **Password hashing** using bcrypt.
- Session management via **JWT issuance & verification**.
- Strict **Role-based authorization checks** ensuring users only see relevant data.
- **Rate limiting** and strict **Input sanitization & injection awareness** across all endpoints.

### 3.2 Frontend (React/Next.js)
- **Server-side rendering (SSR)** for fast initial loads and SEO optimization.
- **Responsive layout & styling competence** using Tailwind CSS.
- Robust **Form handling — controlled inputs** and **Form validation**.
- Comprehensive **Loading & error UI states** for a smooth user experience.
- **Frontend deployment** optimized for Vercel/Netlify.

### 3.3 Backend & Integration
- **Backend deployment** on scalable cloud infrastructure.
- **File upload handling** for assignment submissions.
- **Request body validation** ensuring data integrity.
- **WebSocket / real-time communication** for live chat and notifications.
- **Scheduled jobs / cron** for daily attendance aggregates.
- **Caching with Redis** to optimize dashboard performance.
- **3rd-party API integration** (Stripe, OpenAI/Gemini).

### 3.4 AI Application Engineering
- **Multi-step agent** architecture to assist teachers with grading and lesson planning.
- **RAG — embeddings & vector retrieval** to query school policies and past assignments.
- **Function calling / tool use** allowing the AI to fetch specific student records.
- **Prompt engineering** and **Structured outputs** for reliable JSON responses.
- **Prompt injection awareness & defenses** to secure the AI assistant.
- **Streaming responses** for real-time AI feedback.
- **Token & cost monitoring** to manage API usage effectively.
- **LLM eval sets** used during testing to ensure the AI's accuracy and safety.
