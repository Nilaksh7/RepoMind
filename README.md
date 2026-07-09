<div align="center">

# 🧠 RepoMind

**AI-Powered GitHub Repository Intelligence Platform**

Understand any unfamiliar codebase in minutes—not hours—through semantic search, AI-generated repository summaries, file explanations, dependency graphs, and conversational AI.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

**Import • Search • Understand • Explore Any GitHub Repository**

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [Roadmap](#-roadmap)

</div>

---

# 📖 Overview

Understanding an unfamiliar GitHub repository is often slow and frustrating. Developers spend hours navigating folders, reading source files, tracing dependencies, and figuring out how different components interact before they can contribute productively.

**RepoMind** eliminates that friction by transforming any public GitHub repository into an AI-powered workspace. It combines repository indexing, semantic search, dependency analysis, Retrieval-Augmented Generation (RAG), and Large Language Models to help developers explore and understand codebases significantly faster.

---

# 🎯 Why RepoMind?

Instead of manually reading hundreds of files, RepoMind lets developers:

- Import any public GitHub repository
- Generate an AI-powered repository overview
- Search code using natural language
- Ask questions about the repository
- Understand individual source files instantly
- Explore project architecture through dependency graphs
- Onboard to unfamiliar projects much faster

---

# ✨ Features

| Feature                   | Description                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Repository Import**     | Import any public GitHub repository with automatic indexing, AI embedding generation, and repository refresh when newer commits are detected.                   |
| **AI Repository Summary** | Generate a high-level overview covering project purpose, architecture, modules, technologies, and workflows.                                                    |
| **AI File Explanation**   | Instantly understand any source file, including its responsibilities, code flow, important functions, and interactions with other files.                        |
| **Semantic Code Search**  | Search repositories using natural language instead of filenames or exact symbols (e.g. _authentication_, _JWT_, _payment middleware_).                          |
| **Ask Repository**        | Chat with any imported repository using Retrieval-Augmented Generation (RAG). Ask questions such as _How does authentication work?_ or _Where is JWT verified?_ |
| **Dependency Graph**      | Visualize relationships between files using an interactive dependency graph for easier navigation.                                                              |
| **Google Authentication** | Secure Google OAuth login with JWT-based authentication and user-specific repositories.                                                                         |

---

# 🏗 Architecture

```text
                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                        REST API (JWT)
                             │
                    ┌────────▼────────┐
                    │ Express Backend │
                    └────────┬────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
        ┌──────▼───────┐          ┌────────▼─────────┐
        │ PostgreSQL   │          │ FastAPI AI       │
        │ Repository   │          │ Service          │
        │ Metadata     │          └────────┬─────────┘
        └──────────────┘                   │
                                           ▼
                               Gemini + Sentence Transformers
                                           │
                                           ▼
                                  FAISS Vector Search
```

---

# 🧰 Tech Stack

| Frontend     | Backend      | AI Service            |
| ------------ | ------------ | --------------------- |
| React 19     | Node.js      | FastAPI               |
| Vite         | Express.js   | Google Gemini         |
| Tailwind CSS | PostgreSQL   | Sentence Transformers |
| React Router | JWT          | FAISS                 |
| Axios        | Google OAuth | RAG Pipeline          |
| React Flow   | REST APIs    | Vector Embeddings     |

---

# 📁 Project Structure

```text
RepoMind/
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   └── public/
│
├── backend/               # Express backend
│   ├── src/
│   ├── routes/
│   ├── services/
│   └── database/
│
├── ai-service/            # FastAPI AI service
│   ├── app/
│   ├── api/
│   ├── services/
│   └── utils/
│
├── sample-repos/          # Sample repositories for testing
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js (v18+)
- Python (3.10+)
- PostgreSQL
- Google Gemini API Key
- Google OAuth Client ID

---

## Clone the Repository

```bash
git clone https://github.com/Nilaksh7/RepoMind.git

cd RepoMind
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## AI Service

```bash
cd ai-service

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 🔐 Environment Variables

## backend/.env

```env
DATABASE_URL=

JWT_SECRET=

GOOGLE_CLIENT_ID=

AI_SERVICE_URL=

AI_SERVICE_API_KEY=
```

---

## frontend/.env

```env
VITE_API_URL=

VITE_GOOGLE_CLIENT_ID=
```

---

## ai-service/.env

```env
GEMINI_API_KEY=

GEMINI_MODEL=gemini-3.1-flash-lite
```

---

# 📸 Screenshots

## Landing Page

![Landing](docs/images/landing1.png)

---

## Features

![Features](docs/images/landing2.png)

---

## How It Works

![How It Works](docs/images/landing3.png)

---

## Tech Stack & FAQ

![Tech Stack](docs/images/landing4.png)

![FAQ](docs/images/landing5.png)

---

## Google Login

![Google Login](docs/images/login.png)

---

## Dashboard

![Dashboard](docs/images/dashboard.png)

---

## Import Repository

![Import Repository](docs/images/importrepo.png)

---

## Repository Overview

![Repository Overview](docs/images/repo1.png)

![Repository Overview](docs/images/repo2.png)

---

## Repository Statistics

![Repository Statistics](docs/images/stats.png)

---

## Dependency Graph

![Dependency Graph](docs/images/graph.png)

---

## Semantic Search

![Semantic Search](docs/images/semanticSearch.png)

---

## AI Repository Summary

![AI Summary](docs/images/summary.png)

---

## AI Chat

![AI Chat](docs/images/chatbot.png)

---

## AI File Explanation

![AI File Explanation](docs/images/explain.png)

---

# 🗺 Roadmap

- [ ] Repository comparison
- [ ] AI code review
- [ ] Pull Request summarization
- [ ] Auto-generated architecture diagrams
- [ ] Multi-repository search
- [ ] Team workspaces
- [ ] Repository documentation generation
- [ ] Code quality analysis

---

# 👨‍💻 Author

**Nilaksh Berwal**

Computer Science Undergraduate  
National Institute of Technology Delhi

[![GitHub](https://img.shields.io/badge/GitHub-Nilaksh7-181717?logo=github)](https://github.com/Nilaksh7)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Nilaksh_Berwal-0A66C2?logo=linkedin)](https://www.linkedin.com/in/nilaksh-berwal-g07071952)

---

⭐ If you found RepoMind useful, consider giving the repository a star!
