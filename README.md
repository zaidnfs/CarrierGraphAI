# SkillBridge AI

A GraphRAG-Based Career Intelligence Platform for Job Matching, ATS Resume Optimization, and AI-Driven Mock Interviews.

## 🎯 What Is This?

SkillBridge AI is a career intelligence platform that ingests live job-market data into a knowledge graph, lets students query real skill demands, analyze their resume fit against specific job listings, generate ATS-friendly resumes, and practice with AI-driven mock interviews — all grounded in real, current job-market evidence.

## 🧑‍💻 Team

| Member | Roll Number | Focus Area |
|---|---|---|
| **Md. Zaid Alam** | 2300104127 | Data ingestion, knowledge graph, backend infrastructure |
| **Aquib Javed** | 2300104212 | Agentic LLM/RAG, resume engine, mock interview |

**Supervisor:** `<Supervisor Name>`
**Institution:** Integral University, Lucknow — B.Tech CSE, 2026–2027

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript (Vite) |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS) |
| Styling | Tailwind CSS 3.4 |
| Backend | Django + Django REST Framework |
| Task Queue | Celery + Redis |
| Relational DB | PostgreSQL |
| Knowledge Graph | Neo4j Community Edition |
| Vector Store | Qdrant / ChromaDB |
| LLM | Ollama (Llama 3.1 / Qwen2.5) |
| Agent | LangGraph |
| NER | spaCy |
| Embeddings | sentence-transformers |
| Job Data | Adzuna API (free tier) |
| Resume Gen | python-docx / ReportLab |
| Deployment | HuggingFace Spaces (free tier) |

## 📁 Project Structure

```
Final-Year-project/
├── Docs/                    # Project documentation (PRD, Architecture, Design, etc.)
├── backend/                 # Django project
│   ├── config/              # Settings, URLs, WSGI, Celery
│   ├── apps/                # Django apps (accounts, jobs, resumes, interviews, skills)
│   ├── services/            # Business logic services
│   ├── tasks/               # Celery background tasks
│   └── utils/               # Helpers and utilities
├── frontend/                # React + Vite + shadcn/ui frontend
├── tests/                   # Unit, integration, and E2E tests
├── .env.example             # Environment variable template
├── docker-compose.yml       # Local services (PostgreSQL, Neo4j, Redis, Qdrant)
├── README.md                # This file
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Git
- Node.js 18+

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Final-Year-project
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in the values in `.env`.

3. **Start local services:**
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL, Neo4j, Redis, and Qdrant.

4. **Create virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   venv\Scripts\activate       # Windows
   pip install -r backend/requirements.txt
   ```

5. **Run migrations:**
   ```bash
   cd backend
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

8. **Start Celery worker (separate terminal):**
   ```bash
   celery -A config worker --loglevel=info
   ```

9. **Start Celery beat (separate terminal):**
   ```bash
   celery -A config beat --loglevel=info
   ```

10. **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

11. **Start the frontend dev server:**
    ```bash
    npm run dev
    ```
    The React app runs at `http://localhost:5173` and proxies API requests to Django.

## 📖 Documentation

All project documentation is in the `Docs/` folder:

| File | Purpose |
|---|---|
| `PRD.md` | What we are building and why |
| `ARCHITECTURE.md` | System architecture and tech decisions |
| `DESIGN.md` | Visual design system |
| `RULES.md` | Development rules for AI and humans |
| `TASK.md` | Task breakdown and progress tracking |
| `MEMORY.md` | Current project state |
| `TEST_PLAN.md` | Testing methodology and test cases |
| `SECURITY.md` | Security requirements |
| `DECISIONS.md` | Architecture Decision Records |
| `PROJECT_SYNOPSIS.md` | Full academic synopsis |
| `VIBE_CODING_GUIDE.md` | Vibe coding methodology reference |

## 📜 License

This project is part of a final-year academic submission at Integral University, Lucknow.
