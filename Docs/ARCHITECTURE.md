# Architecture — SkillBridge AI

## Overview

SkillBridge AI follows a **four-layer architecture** that separates data ingestion, storage, intelligence, and application concerns. Each layer communicates through well-defined interfaces and can be developed and tested independently.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│   Django + DRF  │  React + shadcn/ui Frontend │  REST API        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     INTELLIGENCE LAYER                          │
│                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   │
│   │  LangGraph   │   │   Ollama     │   │  Resume Engine   │   │
│   │  Agent       │◄──│  LLM Server  │   │  (parse/score/   │   │
│   │  (Planner)   │   │  (Llama 3.1  │   │   generate)      │   │
│   │              │   │   / Qwen2.5) │   │                  │   │
│   └──────┬───────┘   └──────────────┘   └──────────────────┘   │
│          │                                                      │
│   ┌──────▼───────┐   ┌──────────────┐                          │
│   │  Graph       │   │  Vector      │                          │
│   │  Retriever   │   │  Retriever   │                          │
│   └──────┬───────┘   └──────┬───────┘                          │
└──────────┼──────────────────┼──────────────────────────────────┘
           │                  │
┌──────────▼──────────────────▼──────────────────────────────────┐
│                       STORAGE LAYER                             │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│   │   Neo4j      │  │  Qdrant /    │  │   PostgreSQL       │   │
│   │  (Knowledge  │  │  ChromaDB    │  │   (App data,       │   │
│   │   Graph)     │  │  (Vector     │  │    users, sessions │   │
│   │              │  │   Store)     │  │    resumes)        │   │
│   └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                 │
└────────────────────────────▲────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    DATA INGESTION LAYER                          │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│   │  Adzuna API  │  │  spaCy NER   │  │  Sentence          │   │
│   │  Client      │──│  Skill/Role  │──│  Transformers      │   │
│   │  (Scheduled) │  │  Extraction  │  │  Embedding Gen     │   │
│   └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Celery + Redis (Task Queue & Scheduling)                │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User Request
    ↓
Django View / DRF Endpoint
    ↓
LangGraph Agent (plans retrieval strategy)
    ↓
┌─────────────────────────────────┐
│  Graph Retriever  OR/AND        │
│  Vector Retriever               │
│  (agent decides per query)      │
└─────────────────────────────────┘
    ↓
LLM Synthesizes Grounded Response
    ↓
Django Returns Response to User
```

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript (Vite) | Single-page application, user interface |
| **UI Components** | shadcn/ui (Radix UI + Tailwind CSS) | Accessible, customizable component library |
| **Animations & Effects** | React Bits (reactbits.dev) | 200+ animated, interactive micro-interaction components |
| **Visual Effects** | Libraries.dev (Beam, Orb, Gooey, Metal) | Production-ready WebGL/CSS visual effect libraries |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Backend Framework** | Django + Django REST Framework | API, auth, views, business logic |
| **Task Queue** | Celery + Redis | Scheduled data ingestion, background AI tasks |
| **Relational DB** | PostgreSQL | Users, sessions, resume metadata, app state |
| **Knowledge Graph** | Neo4j Community Edition | Roles, skills, companies, relationships |
| **Vector Store** | Qdrant or ChromaDB | Semantic embeddings for similarity matching |
| **NLP / NER** | spaCy | Skill and role entity extraction from job postings |
| **Embeddings** | sentence-transformers | Generating vector embeddings for resumes and jobs |
| **LLM** | Ollama (Llama 3.1 / Qwen2.5) | Text generation, reasoning, evaluation |
| **Agent Orchestration** | LangGraph | Multi-step retrieval planning and execution |
| **Resume Generation** | python-docx / ReportLab | ATS-friendly DOCX/PDF output |
| **STT (stretch)** | Whisper | Speech-to-text for voice mock interviews |
| **TTS (stretch)** | Piper / Coqui TTS | Text-to-speech for voice mock interviews |
| **Job Data API** | Modular Job Providers (Adzuna, extensible) | Multi-provider job market data sources (Provider pattern) |
| **Deployment** | HuggingFace Spaces (free tier) | Hosting the demo application |
| **Version Control** | Git + GitHub | Source code management |
| **CI / Scheduling** | GitHub Actions | Automated data refresh jobs |

---

## Folder Structure

```
Final-Year-project/
│
├── Docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── RULES.md
│   ├── TASK.md
│   ├── MEMORY.md
│   ├── TEST_PLAN.md
│   ├── SECURITY.md
│   ├── DECISIONS.md
│   ├── VIBE_CODING_GUIDE.md
│   └── PROJECT_SYNOPSIS.md
│
├── backend/
│   ├── config/                  # Django project settings
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── celery.py
│   │
│   ├── apps/
│   │   ├── accounts/            # User auth, profiles
│   │   ├── jobs/                # Job ingestion, listing, querying
│   │   ├── resumes/             # Resume upload, parsing, scoring, generation
│   │   ├── interviews/          # Mock interview module
│   │   └── skills/              # Skill-gap analysis, learning resources
│   │
│   ├── services/
│   │   ├── job_providers/       # Modular provider layer (Strategy/Facade pattern)
│   │   │   ├── base.py          # JobDataProvider ABC contract
│   │   │   ├── adzuna.py        # Adzuna API provider implementation
│   │   │   ├── schemas.py       # Normalized JobListing, SalaryEstimate dataclasses
│   │   │   ├── service.py       # JobDataService facade & multi-provider aggregator
│   │   │   └── exceptions.py    # Domain-specific provider exceptions
│   │   ├── graph_service.py     # Neo4j graph operations

│   │   ├── vector_service.py    # Qdrant/ChromaDB operations
│   │   ├── llm_service.py       # Ollama LLM interaction
│   │   ├── agent_service.py     # LangGraph agent orchestration
│   │   ├── ner_service.py       # spaCy NER extraction
│   │   ├── embedding_service.py # sentence-transformers embeddings
│   │   └── resume_service.py    # Resume parse, score, generate
│   │
│   ├── tasks/
│   │   ├── ingestion.py         # Celery tasks for data ingestion
│   │   └── processing.py        # Background AI processing tasks
│   │
│   ├── utils/
│   │   └── helpers.py
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                    # React + Vite + shadcn/ui
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/              # shadcn/ui components (Button, Card, Input, etc.)
│   │   ├── pages/
│   │   ├── services/            # API client (axios/fetch wrappers for DRF)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities (cn helper, etc.)
│   │   ├── styles/              # Global CSS, design token overrides
│   │   ├── types/               # TypeScript type definitions
│   │   └── App.tsx
│   ├── components.json          # shadcn/ui configuration
│   ├── tailwind.config.ts       # Tailwind CSS configuration
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml           # Neo4j, PostgreSQL, Redis, Qdrant
└── Makefile                     # Common dev commands
```

---

## Knowledge Graph Schema

### Nodes

| Label | Properties | Description |
|---|---|---|
| `Role` | `title`, `normalized_title`, `category` | A job role (e.g. "Backend Developer") |
| `Skill` | `name`, `normalized_name`, `category` | A skill (e.g. "Python", "Django", "Docker") |
| `Company` | `name`, `industry`, `size` | A hiring company |
| `Location` | `city`, `state`, `country` | Job location |
| `JobPosting` | `id`, `title`, `description`, `salary_min`, `salary_max`, `posted_date`, `source_url` | A raw job posting |

### Relationships

| Relationship | From | To | Properties |
|---|---|---|---|
| `REQUIRES` | `JobPosting` | `Skill` | `importance` (required/preferred) |
| `POSTED_BY` | `JobPosting` | `Company` | |
| `LOCATED_IN` | `JobPosting` | `Location` | |
| `BELONGS_TO` | `JobPosting` | `Role` | |
| `RELATED_TO` | `Skill` | `Skill` | `co_occurrence_count` |
| `COMMON_FOR` | `Skill` | `Role` | `frequency`, `trend` |

---

## Architectural Rules

1. **UI components must not contain database logic.** Views call services; services handle data access.
2. **Database operations belong in `services/`.** Django views/serializers never query Neo4j or Qdrant directly.
3. **Authentication must be verified server-side.** Every protected endpoint checks auth via Django middleware or DRF permissions.
4. **Reusable UI goes in `components/`.** Page-specific UI stays in `pages/`.
5. **Business logic is separate from UI.** The intelligence layer (agent, LLM, NER) is accessed only through `services/`.
6. **LLM prompts live in versioned template files**, not hardcoded in Python functions.
7. **The LangGraph agent decides retrieval strategy.** Application code never directly chooses between graph and vector retrieval — the agent plans the retrieval path.
8. **Background tasks use Celery.** No long-running operations in Django request/response cycle.
9. **Environment-specific config uses Django settings split** (`base.py`, `development.py`, `production.py`).
10. **All secrets are loaded from environment variables**, never committed to source control.
