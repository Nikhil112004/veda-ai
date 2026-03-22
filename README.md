🧠 VedaAI – AI Assessment Creator

🚀 Overview

VedaAI is an AI-powered Assessment Creation Platform that allows teachers to:

- Create assignments
- Generate structured question papers using AI
- View and download formatted exam papers

The system is built with a scalable full-stack architecture using queues, real-time updates, and AI integration.

---

🏗️ Architecture

Frontend (Next.js)
        ↓
API Server (Express)
        ↓
Queue (BullMQ + Redis)
        ↓
Worker (AI Processing)
        ↓
MongoDB (Storage)
        ↓
WebSocket (Real-time updates)

---

⚙️ Tech Stack

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- WebSocket (Real-time updates)

Backend

- Node.js + Express (TypeScript)
- MongoDB (Database)
- Redis (Caching + Pub/Sub)
- BullMQ (Background Jobs)

AI

- Google Gemini API
- Zod (Schema validation)
- Structured output parsing

---

🔄 System Flow

1. User creates an assignment from frontend
2. Request sent to backend API
3. Job added to BullMQ queue
4. Worker processes AI generation
5. Result stored in MongoDB + Redis
6. WebSocket notifies frontend
7. UI updates in real-time

---

🧠 AI Handling Strategy

Due to real-world inconsistencies in LLM outputs, a hybrid approach is used:

- Prompt engineering for structured responses
- Cleanup logic for malformed JSON
- Zod schema validation for strict enforcement
- Fallback system for reliability (handles quota failures)

This ensures the system never breaks even if AI fails.

---

✨ Features

- Assignment creation form (with validation)
- AI-based question generation
- Structured question paper (sections, marks, difficulty)
- Real-time progress tracking
- PDF download support
- Mobile responsive UI

---

⚠️ Challenges & Solutions

1. Inconsistent AI Output

- Solved using Zod validation + cleanup layer

2. API Quota Limits

- Implemented fallback question generation system

3. Background Processing

- Used BullMQ + Worker for async job handling

---

📦 Setup Instructions

1. Clone repo

git clone <repo-url>
cd VedaAI

2. Install dependencies

pnpm install

3. Setup environment variables

Create ".env" inside "apps/server":

GEMINI_API_KEY=your_api_key_here
MONGO_URI=your_mongo_uri
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

4. Run services

pnpm dev        # start server
pnpm worker     # start worker
pnpm dev:web    # start frontend

---

🌐 Deployment

- Frontend → Vercel
- Backend → Render 
- Worker → Separate service
- MongoDB → Atlas
- Redis → Upstash / Local

---

📌 Notes

- AI generation includes fallback logic to ensure reliability
- Structured output is enforced using Zod schema validation
- Designed for scalability and real-world robustness

---

👨‍💻 Author

Nikhil Gupta
Full Stack Developer | AI Enthusiast