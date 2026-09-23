# Product Requirements Document — SkillBridge AI

## Product

**SkillBridge AI** — A GraphRAG-Based Career Intelligence Platform for Job Matching, ATS Resume Optimization, and AI-Driven Mock Interviews.

---

## Problem

Students preparing for placements face three linked but unaddressed problems:

1. **Job search is unintelligent.** Platforms return listings but do not explain what skills are actually in demand for a role, or how requirements are trending over time and location.
2. **Resumes are generic.** Resume-building tools produce formatted documents that are not tailored to the specific skills a target job listing asks for, and most are not verified to be ATS-parseable.
3. **Interview preparation is disconnected.** Preparation material is generic and not tied to the requirements of a specific role a student is applying for.

Current solutions operate on isolated, unstructured data using simple keyword or similarity matching. None can reason across relationships such as "which of my missing skills are most frequently required together for this role" or "how has demand for this skill changed recently."

---

## Target Users

- Final-year B.Tech / BCA / BSc CS students preparing for campus placements.
- Early-career professionals exploring role transitions.
- Students who want evidence-based career guidance grounded in live job-market data.

---

## Goal

Create a single AI-driven platform that treats job-market data as a structured, queryable knowledge source. Unify job discovery, resume tailoring, skill-gap analysis, and interview preparation around one underlying knowledge graph of roles, skills, and companies — so that every recommendation is grounded in real, current job-market evidence rather than generic advice.

---

## Core Features

1. **Job Market Intelligence** — Ingest live job postings via Adzuna API into a knowledge graph (Neo4j) + vector store (Qdrant/ChromaDB). Answer reasoning-based queries about roles, skills, companies, and trends.
2. **Resume Fit Scoring** — Parse an uploaded resume, compare it against a specific job listing, and compute a fit score with a clear breakdown.
3. **ATS Resume Generation** — Generate an ATS-friendly resume tailored to a selected job listing, emphasizing matched skills and addressing gaps.
4. **Skill-Gap Analysis & Learning Resources** — Identify missing skills for a target role and link each gap to curated, free learning resources.
5. **AI Mock Interview** — Generate role-specific interview questions grounded in the knowledge graph and evaluate user answers with constructive feedback.

---

## MVP (Phase 1 + Phase 2)

### Must Have

- [x] User authentication (signup, login, logout)
- [ ] Adzuna API data ingestion pipeline (scheduled via Celery)
- [ ] Skill and role extraction from job postings (spaCy NER)
- [ ] Knowledge graph construction in Neo4j
- [ ] Vector store population with sentence-transformer embeddings
- [ ] Agentic GraphRAG query system (LangGraph + Ollama)
- [ ] Dashboard showing job market insights
- [ ] Resume upload and parsing (PDF/DOCX)
- [ ] Fit score computation against a selected job listing
- [ ] Skill-gap identification with missing skills list
- [ ] ATS-friendly resume generation (python-docx / ReportLab)

### Should Have (Phase 3)

- [ ] Skill-gap-to-learning-resource recommendations
- [ ] Text-based AI mock interview module
- [ ] Interview answer evaluation with feedback

### Could Have (Stretch)

- [ ] Speech-based mock interview (Whisper STT + Piper/Coqui TTS)
- [ ] Trend visualizations (skill demand over time, by city)

---

## Out of Scope (v1)

- Direct scraping of LinkedIn, Naukri, or any platform prohibiting automated scraping.
- Mobile application.
- Payment processing or premium tier.
- Social features, community forums, or gamification.
- Any guarantee of job placement or interview outcomes.
- Coverage beyond the roles, cities, and volume available on the Adzuna free tier.

---

## Success Criteria

A user should be able to:

1. Create an account and log in securely.
2. View a dashboard with job market intelligence for their target role.
3. Ask reasoning-based questions about roles, skills, and trends and receive grounded answers.
4. Upload their resume (PDF or DOCX).
5. Select a job listing and see a fit score with detailed breakdown.
6. See which skills they are missing for the selected role.
7. Download an ATS-friendly resume tailored to that specific listing.
8. Access curated learning resources for each identified skill gap.
9. Start a text-based mock interview for a target role.
10. Receive evaluation and feedback on their interview answers.

---

## User Flows

### Flow 1: Job Market Query

```
Login → Dashboard → Enter query (e.g. "What Python skills are most in demand for backend roles in Bangalore?")
→ Agent reasons over Graph + Vector Store → Grounded answer displayed
```

### Flow 2: Resume Fit Scoring

```
Login → Upload Resume → Browse/Search Job Listings → Select a Listing
→ System parses resume → Computes fit score → Displays matched skills, missing skills, score breakdown
```

### Flow 3: ATS Resume Generation

```
(After Fit Scoring) → Click "Generate ATS Resume" → System tailors resume to listing
→ User previews → Downloads ATS-friendly DOCX/PDF
```

### Flow 4: Mock Interview

```
Login → Select Target Role → Start Interview → System generates role-specific questions
→ User types answers → System evaluates → Feedback displayed → Session summary
```

---

## Constraints

- All job data sourced exclusively through the Adzuna API (legitimate, free tier).
- LLM inference via locally hosted Ollama (Llama 3.1 / Qwen2.5) with free-tier hosted fallback.
- Deployment target: HuggingFace Spaces (free tier) or similar.
- Team of 2 developers; 14-week timeline.

---

## Team

| Member | Roll Number | Primary Responsibility |
|---|---|---|
| **Md. Zaid Alam** | 2300104127 | Data ingestion pipeline, knowledge-graph schema/construction, backend infrastructure (Django, Celery, deployment) |
| **Aquib Javed** | 2300104212 | Agentic LLM/RAG layer, resume parsing/ATS generation, skill-gap recommendations, mock interview module |

Both members collaborate on frontend integration, testing, and documentation.
