# Project Memory — SkillBridge AI

> This is a living document. Update it whenever the project state changes.

---

## Current Status

**Phase:** Phase 1: Project Setup & Data Ingestion Pipeline.

**Active Task:** Phase 1.1 Complete. Ready for Phase 1.2 Data Ingestion Pipeline (TASK-010).

---

## Completed

- [x] Created project repository and initialized Git.
- [x] Created `Docs/` folder structure.
- [x] Created `VIBE_CODING_GUIDE.md` — Complete vibe coding reference.
- [x] Created `PROJECT_SYNOPSIS.md` — Full academic synopsis for SkillBridge AI.
- [x] Created `PRD.md` — Product Requirements Document.
- [x] Created `ARCHITECTURE.md` — System architecture, tech stack, folder structure, graph schema.
- [x] Created `DESIGN.md` — Visual design system tokens and UX requirements.
- [x] Created `RULES.md` — Development rules for AI agents and developers.
- [x] Created `TASK.md` — 72 atomic tasks across 3 implementation phases.
- [x] Created `MEMORY.md` — This file.
- [x] Created `TEST_PLAN.md` — Testing methodology and test cases.
- [x] Created `SECURITY.md` — Security requirements and threat checklist.
- [x] Created `DECISIONS.md` — Architecture Decision Records.
- [x] TASK-001: Initialized Django 5.1 backend with split settings (base, development, production).
- [x] TASK-002: Configured PostgreSQL database connection with dj-database-url (and SQLite fallback).
- [x] TASK-003: Created `accounts` app with custom User model (email, first_name, last_name, timestamps).
- [x] TASK-004: Implemented JWT authentication (signup, login, token refresh, logout/blacklist, me) with DRF + SimpleJWT.
- [x] TASK-005: Configured Celery 5.6 + Redis with django-celery-results.
- [x] TASK-006: Created `docker-compose.yml` for PostgreSQL, Neo4j, Redis, and Qdrant.
- [x] TASK-007: Configured `.env.example`, `.env`, `.gitignore`, and project setup.
- [x] TASK-008: Configured CORS, CSRF, and security middleware for Vite frontend (`localhost:5173`).
- [x] TASK-009: Configured pytest-django and wrote 11 unit tests covering all auth flows (100% passing).

---

## Current Task

Phase 1.1 completed. Ready to start **TASK-010**: Create Adzuna API client (`services/adzuna_client.py`).

---

## Known Issues

- None. All 11 pytest unit tests pass cleanly.

---

## Blockers

- None currently.

---

## Next Steps

1. Start **Phase 1.2 — Data Ingestion Pipeline**:
   - TASK-010: Create Adzuna API client (`services/adzuna_client.py`)
   - TASK-011: Define job posting Django model (PostgreSQL) for raw storage
   - TASK-012: Implement scheduled Celery task to fetch job postings from Adzuna

---

## Environment Notes

- **OS:** Windows
- **IDE:** Antigravity IDE
- **Python version:** (to be set up)
- **Node.js version:** 18+ (required — React + Vite frontend)
- **Docker:** Required for Neo4j, PostgreSQL, Redis, Qdrant local services

---

## Team

| Member | Primary Focus |
|---|---|
| **Md. Zaid Alam** | Data ingestion, knowledge graph, backend infrastructure |
| **Aquib Javed** | Agentic LLM/RAG, resume engine, mock interview module |
