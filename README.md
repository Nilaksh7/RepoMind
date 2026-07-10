<div align="center">

# 🧠 RepoMind

****AI-Powered GitHub Repository Intelligence Platform built with Semantic Search, Vector Embeddings, and Retrieval-Augmented Generation (RAG).****

Understand any unfamiliar codebase in minutes—not hours—through semantic search, AI-generated repository summaries, file explanations, dependency graphs, and conversational AI.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Cohere](https://img.shields.io/badge/Cohere-Embeddings-FF6B35)](https://cohere.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Import • Search • Understand • Explore Any GitHub Repository**

🚀 **Live Demo:** https://repo-mind-mu.vercel.app
⚡ **Architecture:** React • Express • FastAPI • PostgreSQL • pgvector • Gemini • Cohere

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [Roadmap](#-roadmap)

</div>

---

# 📖 Overview

Understanding an unfamiliar GitHub repository is often slow and frustrating. Developers spend hours navigating folders, reading source files, tracing dependencies, and figuring out how different components interact before they can contribute productively.

**RepoMind** transforms any public GitHub repository into an AI-powered workspace. It combines repository indexing, semantic code search, vector embeddings, Retrieval-Augmented Generation (RAG), dependency analysis, and Large Language Models to help developers understand unfamiliar codebases significantly faster.

---

# 🚀 Key Highlights

- Import and analyze any public GitHub repository
- Automatic repository indexing and metadata extraction
- Intelligent source code chunking
- Vector embedding generation using Cohere
- Semantic code search powered by pgvector
- Retrieval-Augmented Generation (RAG) with Google Gemini
- AI-generated repository summaries and file explanations
- Interactive dependency graph visualization
- Automatic repository refresh using latest Git commit SHA
- Google OAuth authentication with JWT-based authorization

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

| Feature | Description |
|---------|-------------|
| **Repository Import & Indexing** | Validates, clones, indexes, chunks source files, generates vector embeddings, stores repository metadata, and automatically refreshes repositories when newer commits are detected. |
| **AI Repository Summary** | Generate a high-level overview covering project purpose, architecture, modules, technologies, and workflows. |
| **AI File Explanation** | Instantly understand any source file, including its responsibilities, code flow, important functions, and interactions with other files. |
| **Semantic Code Search** | Search repositories using natural language instead of filenames or exact symbols (e.g. *authentication*, *JWT*, *payment middleware*). |
| **Ask Repository** | Chat with any imported repository using Retrieval-Augmented Generation (RAG). Ask questions such as *How does authentication work?* or *Where is JWT verified?* |
| **Dependency Graph** | Visualize relationships between files using an interactive dependency graph for easier navigation. |
| **Google Authentication** | Secure Google OAuth login with JWT-based authentication and user-specific repositories. |

---

# ⚙️ How RepoMind Works

Every imported repository goes through an AI-powered indexing pipeline before becoming searchable.

```text
Public GitHub Repository
            │
            ▼
 Repository Validation
            │
            ▼
     Git Clone
            │
            ▼
 Repository Traversal
            │
            ▼
 Metadata Extraction
            │
            ▼
 Binary File Filtering
            │
            ▼
 Intelligent Text Chunking
            │
            ▼
 Cohere Embeddings
            │
            ▼
 PostgreSQL + pgvector
            │
            ▼
 Semantic Retrieval
            │
            ▼
 Google Gemini (RAG)
            │
            ▼
 AI-powered Responses
```

### During indexing RepoMind automatically:

- Traverses the repository recursively
- Builds the repository file tree
- Extracts readable source code
- Skips binary and unsupported files
- Chunks large files into semantic segments
- Generates vector embeddings
- Stores embeddings in PostgreSQL using pgvector
- Enables semantic search and Retrieval-Augmented Generation (RAG)

# 🏗 Architecture

```text
                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                         REST API
                             │
                    ┌────────▼────────┐
                    │ Express Backend │
                    └────────┬────────┘
                             │
      Repository Import • Indexing • AI Orchestration
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
          ▼                                     ▼
 ┌──────────────────────┐            ┌──────────────────────┐
 │ PostgreSQL           │            │ FastAPI AI Service   │
 │ + pgvector           │            │                      │
 │                      │            │ • Chunking           │
 │ • Repository Data    │            │ • Cohere Embeddings  │
 │ • File Metadata      │            │ • Semantic Retrieval │
 │ • Vector Embeddings  │            │ • Gemini (RAG)       │
 └──────────┬───────────┘            └──────────┬───────────┘
            └──────────────────┬────────────────┘
                               ▼
                  AI-Powered Repository Insights
```

---

# 🧰 Tech Stack

# 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Axios, React Flow |
| **Backend** | Node.js, Express.js, JWT Authentication, Google OAuth |
| **AI Service** | FastAPI, Google Gemini, Cohere Embed API |
| **Database** | PostgreSQL, pgvector |
| **AI Techniques** | Retrieval-Augmented Generation (RAG), Semantic Search, Vector Embeddings, Intelligent Text Chunking |
| **Deployment** | Vercel, Render, Supabase |

---

# ⚡ Technical Highlights

- Multi-service architecture using React, Express, and FastAPI
- Automatic GitHub repository version detection using latest commit SHA
- Recursive repository traversal and metadata extraction
- Binary file detection and filtering
- Intelligent source code chunking
- Batch vector embedding generation
- Semantic similarity search using PostgreSQL pgvector
- Retrieval-Augmented Generation (RAG) with Google Gemini
- Interactive dependency graph generation
- Secure Google OAuth authentication with JWT-based authorization


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
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js (v18+)
- Python (3.10+)
- PostgreSQL with pgvector extension
- Google Gemini API Key
- Cohere API Key
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

GITHUB_TOKEN=

AI_SERVICE_URL=

AI_SERVICE_API_KEY=

GITHUB_TOKEN=
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
DATABASE_URL=

GEMINI_API_KEY=

COHERE_API_KEY=

GEMINI_MODEL=gemini-3.1-flash-lite

AI_SERVICE_API_KEY=

AI_SERVICE_API_KEY=
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

# 🎯 Built For

RepoMind is designed to help:

- Developers onboarding to unfamiliar codebases
- Open-source contributors
- Software engineering teams
- Students learning large projects
- Technical interview preparation

# 🗺 Roadmap

- [ ] Repository comparison
- [ ] AI code review
- [ ] Pull Request summarization
- [ ] Incremental repository indexing
- [ ] Multi-repository semantic search
- [ ] Auto-generated architecture diagrams
- [ ] Team workspaces
- [ ] Repository documentation generation
- [ ] Code quality analysis

---

# 👨‍💻 Author

**Nilaksh Berwal**

Computer Science Undergraduate at **National Institute of Technology Delhi**

[![GitHub](https://img.shields.io/badge/GitHub-Nilaksh7-181717?logo=github)](https://github.com/Nilaksh7)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Nilaksh_Berwal-0A66C2?logo=linkedin)](https://www.linkedin.com/in/nilaksh-berwal-g07071952)

---

⭐ **If you found RepoMind useful, consider giving the repository a star!**
