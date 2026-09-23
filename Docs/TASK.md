# Tasks — SkillBridge AI

> **Workflow per task:** `Understand → Plan → Implement → Test → Review → Commit → Update Docs`

---

## Phase 1: Project Setup & Data Ingestion Pipeline

### 1.1 Project Initialization

- [x] TASK-001: Initialize Django project with split settings (base, development, production)
- [x] TASK-002: Configure PostgreSQL database connection
- [x] TASK-003: Create `accounts` app with custom User model
- [x] TASK-004: Set up user authentication (signup, login, logout) with DRF
- [x] TASK-005: Configure Celery + Redis for background task processing
- [x] TASK-006: Create `docker-compose.yml` for local services (PostgreSQL, Neo4j, Redis, Qdrant)
- [x] TASK-007: Set up `.env.example`, `.gitignore`, and initial `README.md`
- [x] TASK-008: Configure CORS, CSRF, and security middleware
- [x] TASK-009: Set up pytest and initial test configuration

### 1.2 Data Ingestion Pipeline

- [ ] TASK-010: Create Adzuna API client (`services/adzuna_client.py`)
- [ ] TASK-011: Define job posting Django model (PostgreSQL) for raw storage
- [ ] TASK-012: Implement scheduled Celery task to fetch job postings from Adzuna
- [ ] TASK-013: Implement spaCy NER pipeline for skill/role extraction (`services/ner_service.py`)
- [ ] TASK-014: Create sentence-transformer embedding generation service (`services/embedding_service.py`)
- [ ] TASK-015: Write unit tests for Adzuna client and NER extraction

### 1.3 Knowledge Graph & Vector Store

- [ ] TASK-016: Set up Neo4j connection and driver (`services/graph_service.py`)
- [ ] TASK-017: Implement knowledge graph schema (Role, Skill, Company, Location, JobPosting nodes and relationships)
- [ ] TASK-018: Build ingestion-to-graph pipeline (extracted entities → Neo4j)
- [ ] TASK-019: Set up Qdrant/ChromaDB vector store (`services/vector_service.py`)
- [ ] TASK-020: Build ingestion-to-vector pipeline (job embeddings → vector store)
- [ ] TASK-021: Write integration tests for graph and vector store pipelines
- [ ] TASK-022: End-to-end test: Adzuna fetch → NER extract → Graph + Vector store populated

---

## Phase 2: Intelligence Layer & Resume Engine

### 2.1 Agentic Query System

- [ ] TASK-023: Set up Ollama LLM service (`services/llm_service.py`)
- [ ] TASK-024: Create graph retriever (Cypher queries for role/skill/trend questions)
- [ ] TASK-025: Create vector retriever (semantic similarity search)
- [ ] TASK-026: Build LangGraph agent that plans retrieval strategy (`services/agent_service.py`)
- [ ] TASK-027: Create DRF endpoint for job market queries
- [ ] TASK-028: Write tests for agent reasoning across graph and vector store

### 2.2 Resume Module

- [ ] TASK-029: Create `resumes` Django app and Resume model
- [ ] TASK-030: Implement resume upload endpoint (PDF/DOCX)
- [ ] TASK-031: Implement resume parser — extract text, skills, experience (`services/resume_service.py`)
- [ ] TASK-032: Implement fit score computation (resume skills vs. job listing requirements)
- [ ] TASK-033: Implement skill-gap identification (missing skills list)
- [ ] TASK-034: Implement ATS-friendly resume generation (python-docx / ReportLab)
- [ ] TASK-035: Create DRF endpoints for resume analysis and ATS resume download
- [ ] TASK-036: Write tests for resume parsing, scoring, and generation

### 2.3 Frontend — Core Pages

- [ ] TASK-037: Set up React frontend (Vite + TypeScript + shadcn/ui + Tailwind CSS)
  - [ ] Initialize Vite project with React + TypeScript template
  - [ ] Configure Tailwind CSS 3.4
  - [ ] Install and configure shadcn/ui (components.json, cn utility)
  - [ ] Set up project structure (components/ui, pages, services, hooks, lib, types)
  - [ ] Configure Vite proxy for Django API during development
- [ ] TASK-038: Implement auth pages (Login, Signup) following DESIGN.md
- [ ] TASK-039: Implement Dashboard page with market insights
- [ ] TASK-040: Implement Job Explorer page with search and filters
- [ ] TASK-041: Implement Resume Analyzer page (upload, score, gaps, download)
- [ ] TASK-042: Implement responsive navigation (sidebar + mobile bottom nav)
- [ ] TASK-043: Add loading states, empty states, and error states to all pages
- [ ] TASK-044: Test all pages at 375px, 768px, 1024px, 1440px

---

## Phase 3: Mock Interview, Integration & Deployment

### 3.1 Skill-Gap & Learning Resources

- [ ] TASK-045: Create `skills` Django app
- [ ] TASK-046: Build skill-gap-to-learning-resource mapping (curated free resources)
- [ ] TASK-047: Create DRF endpoint for skill-gap recommendations
- [ ] TASK-048: Integrate skill-gap recommendations into Resume Analyzer page

### 3.2 AI Mock Interview

- [ ] TASK-049: Create `interviews` Django app and InterviewSession model
- [ ] TASK-050: Implement interview question generation from knowledge graph + LLM
- [ ] TASK-051: Implement answer evaluation with LLM feedback
- [ ] TASK-052: Create DRF endpoints for interview sessions
- [ ] TASK-053: Implement Mock Interview page (chat-style UI)
- [ ] TASK-054: Write tests for question generation and answer evaluation

### 3.3 Speech Interface (Stretch Goal)

- [ ] TASK-055: Integrate Whisper for speech-to-text input
- [ ] TASK-056: Integrate Piper/Coqui TTS for text-to-speech output
- [ ] TASK-057: Add voice mode toggle to Mock Interview page

### 3.4 Integration Testing & Polish

- [ ] TASK-058: Full integration test: Signup → Upload Resume → Select Job → Fit Score → ATS Resume → Mock Interview
- [ ] TASK-059: Security review (see SECURITY.md)
- [ ] TASK-060: Performance review (query times, LLM latency, page load)
- [ ] TASK-061: Accessibility review (keyboard nav, screen reader, contrast)
- [ ] TASK-062: Fix all identified bugs and issues

### 3.5 Deployment

- [ ] TASK-063: Prepare production Django settings
- [ ] TASK-064: Create deployment configuration (HuggingFace Spaces / alternative)
- [ ] TASK-065: Set production environment variables
- [ ] TASK-066: Deploy to preview environment and test
- [ ] TASK-067: Deploy to production
- [ ] TASK-068: Verify all features on live deployment

### 3.6 Documentation & Report

- [ ] TASK-069: Finalize README.md with setup instructions
- [ ] TASK-070: Update all Docs/ files to reflect final state
- [ ] TASK-071: Prepare final project report
- [ ] TASK-072: Prepare demo presentation
