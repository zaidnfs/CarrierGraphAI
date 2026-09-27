# Architecture Decisions — SkillBridge AI

> This file stores permanent architectural decisions. Once recorded, a decision is not changed without a new ADR that supersedes it.

---

## ADR-001: Hybrid GraphRAG (Neo4j + Qdrant) Over Standard Vector Search Alone

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The project needs to answer reasoning-based queries about job market data — questions like "which skills are most frequently required together for backend roles" or "how has demand for Python changed across cities." Standard vector similarity search can find semantically similar documents but cannot traverse explicit relationships or compute aggregations over structured entities.

**Decision:**
Use a **hybrid retrieval approach**: Neo4j knowledge graph for structured relationship and trend queries (GraphRAG), combined with Qdrant/ChromaDB vector store for semantic similarity matching (e.g., resume-to-job-description matching).

**Consequences:**
- Requires maintaining two data stores (Neo4j + vector store) alongside PostgreSQL.
- Ingestion pipeline must populate both stores.
- The LangGraph agent must decide which retriever to use per query.
- More complex infrastructure but significantly more capable query answering.

---

## ADR-002: Django + DRF for Backend Instead of FastAPI or Separate Backend

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The project needs a backend framework that supports authentication, ORM, admin panel, background tasks (Celery), and REST API endpoints. The team has familiarity with Django from coursework.

**Decision:**
Use **Django with Django REST Framework** as the unified backend. Use Django's built-in auth, ORM for PostgreSQL, and DRF for all API endpoints.

**Consequences:**
- Mature ecosystem with excellent documentation.
- Built-in admin panel useful for inspecting ingested data during development.
- Celery integrates natively with Django.
- Slightly more boilerplate than FastAPI, but better ecosystem support for the full-stack features needed.

---

## ADR-003: Local Ollama (Llama 3.1 / Qwen2.5) with Hosted Fallback

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The project requires LLM inference for query answering, resume generation, and interview evaluation. Using a paid API (OpenAI, Anthropic) would add cost and dependency. The project aims to use open-source tools.

**Decision:**
Use **Ollama** to serve an open-source LLM (Llama 3.1 8B or Qwen2.5 7B) locally. If local hardware is insufficient (< 16 GB RAM), fall back to a **free-tier hosted inference API** (e.g., HuggingFace Inference API, Groq free tier).

**Consequences:**
- No cost for LLM inference during development.
- Model quality depends on the chosen open-source model (smaller than GPT-4, but sufficient for the use cases).
- Requires configuring `OLLAMA_BASE_URL` to switch between local and hosted inference.
- Response latency may be higher on consumer hardware.

---

## ADR-004: Adzuna API as Sole Job Data Source

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The project needs live job market data. Scraping LinkedIn, Naukri, or Indeed violates their terms of service and is technically fragile. A legitimate API is required.

**Decision:**
Use the **Adzuna Job Search API** (free tier) as the sole source of job postings. Scope ingestion to a defined set of roles and Indian cities.

**Consequences:**
- Legitimate and legally safe.
- Free tier has rate limits and volume caps — the knowledge graph will reflect whatever data is available within those limits.
- Job listings may not cover all Indian cities or niche roles.
- This is acceptable for a final-year project demonstration.

---

## ADR-005: LangGraph for Agent Orchestration

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The project's intelligence layer needs an agent that can plan multi-step retrieval (graph query, then vector search, then synthesize) based on the user's query. A simple sequential chain is insufficient because different queries require different retrieval strategies.

**Decision:**
Use **LangGraph** to build the agentic orchestration layer. The agent plans a retrieval strategy, executes steps (graph retriever, vector retriever), and uses the LLM to synthesize a final answer.

**Consequences:**
- More expressive than a simple LangChain sequential chain.
- Requires understanding LangGraph's state graph model.
- Agent behavior is testable by mocking retrievers and observing the plan.

---

## ADR-006: Celery + Redis for Background Task Processing

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
Data ingestion from Adzuna must run on a schedule. LLM inference and resume processing can be slow. These operations must not block the Django request/response cycle.

**Decision:**
Use **Celery** with **Redis** as the message broker for all background and scheduled tasks.

**Consequences:**
- Redis must be running locally (Docker) and in production.
- Celery beat handles periodic scheduling (e.g., daily Adzuna ingestion).
- All long-running AI operations (LLM calls, embedding generation) are dispatched as Celery tasks.

---

## ADR-007: python-docx for ATS Resume Generation

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The system needs to generate ATS-friendly resumes. ATS systems parse DOCX more reliably than PDF (which often loses structure in parsing). The output must be a clean, single-column, well-structured Word document.

**Decision:**
Use **python-docx** as the primary resume generation library. Optionally add **ReportLab** for PDF output as a secondary format.

**Consequences:**
- DOCX is the primary output format (ATS-optimized).
- PDF is a secondary/stretch output.
- Formatting must be simple and ATS-friendly: no tables for layout, no text boxes, no columns, standard fonts.

---

## ADR-008: PostgreSQL for Application Data Alongside Neo4j for Graph Data

**Date:** 2026-09-21

**Status:** Accepted

**Context:**
The project needs both relational data (users, sessions, resume metadata, settings) and graph data (roles, skills, companies, relationships). Using Neo4j for everything would be inappropriate — it's not designed for transactional user data.

**Decision:**
Use **PostgreSQL** (via Django ORM) for all application/transactional data. Use **Neo4j** exclusively for the knowledge graph. The two databases are complementary, not competing.

**Consequences:**
- Two database systems to manage (Docker simplifies local setup).
- Clear separation: Django models → PostgreSQL, knowledge graph entities → Neo4j.
- No cross-database transactions (acceptable for this use case).

---

## ADR-009: React + Vite + shadcn/ui for Frontend Instead of Django Templates

**Date:** 2026-09-23

**Status:** Accepted

**Context:**
The project requires a modern, interactive frontend with reusable UI components for dashboards, real-time chat interfaces (mock interview), data-rich displays (fit scores, skill graphs, trend charts), and complex form interactions (resume upload, query builder). Django templates are server-rendered and lack the interactivity, component reusability, and developer experience needed for these use cases.

**Decision:**
Use **React 18 with TypeScript**, built via **Vite**, with **shadcn/ui** (built on Radix UI + Tailwind CSS) as the component library. The React frontend is a standalone single-page application that communicates with Django exclusively through the DRF REST API.

**Key choices:**
- **Vite** over Next.js — Django handles all backend concerns; a client-side SPA is sufficient and simpler.
- **shadcn/ui** over MUI/Chakra/Ant Design — Components are copy-pasted into the project (not an npm dependency), giving full control over styling and behavior. Built on accessible Radix UI primitives. Uses Tailwind CSS which aligns with the project's design token system.
- **React Bits** (reactbits.dev) — 200+ animated, interactive micro-interaction components for visual polish (copy-paste model, like shadcn/ui).
- **Libraries.dev** — Production-ready visual effect libraries (Beam, Orb, Gooey, Metal, Image) installed via npm for premium UI effects.
- **TypeScript** — Type safety across the frontend, better DX, catches errors at compile time.

**Consequences:**
- Requires a separate Vite dev server during development (port 5173 by default).
- CORS must be configured on Django to allow the frontend origin.
- Node.js 18+ is required in the development environment.
- shadcn/ui components are owned by the project (copied into `src/components/ui/`), not installed as a dependency — updates are manual but intentional.
- Clear API contract between frontend and backend enforced by DRF serializers.
- Frontend and backend can be developed and tested independently.

---

## ADR-010: Provider/Strategy Pattern for Modular Job Market Ingestion

**Date:** 2026-09-23

**Status:** Accepted (Extends and modularizes ADR-004)

**Context:**
ADR-004 selected the Adzuna API as the primary job market data source. However, directly coupling application services, Celery tasks, and AI retrieval agents to Adzuna's specific request/response schema would create technical debt and vendor lock-in. As the platform grows, we may need to switch providers, add secondary providers (e.g., Reed, Jooble, Indeed), or aggregate results across multiple platforms simultaneously.

**Decision:**
Implement a **Provider / Strategy pattern** in `services/job_providers/`:
- **`JobDataProvider` (ABC):** An abstract contract defining `search_jobs()`, `get_salary_data()`, `get_categories()`, and `health_check()`.
- **Normalized Data Schemas:** `JobListing` and `SalaryEstimate` dataclasses provide a uniform data representation regardless of source, with built-in deduplication keys.
- **`AdzunaProvider`:** Concrete implementation of the contract for the Adzuna API using `httpx`.
- **`JobDataService` (Facade & Aggregator):** Orchestrates active providers based on priority, fans out searches, provides graceful degradation on provider failures, deduplicates cross-provider results, and offers a singleton factory (`get_job_service()`).
- **Configuration-Driven:** Providers are enabled and prioritized via Django `settings.JOB_PROVIDERS`.

**Consequences:**
- Consumer code (Celery ingestion tasks, DRF views, LangGraph agents) is 100% provider-agnostic.
- Adding a new job API requires only adding a new provider subclass and configuration entry — zero consumer code changes.
- Enables multi-provider aggregation and cross-platform deduplication out of the box.
- Greatly simplifies unit testing via mock providers without external network dependencies.
