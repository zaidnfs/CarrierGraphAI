# PCS 26 — SYNOPSIS

## SkillBridge AI: A GraphRAG-Based Career Intelligence Platform for Job Matching, ATS Resume Optimization, and AI-Driven Mock Interviews

**Bachelor of Technology**  
**Computer Science & Engineering**  

**Under Supervision of:**  
`<Supervisor’s Name >`

**SUBMITTED BY:**  
- **Md. Zaid Alam**: 2300104127  
- **Aquib Javed**: 2300104212  

**INTEGRAL UNIVERSITY LUCKNOW**  
**2026-2027**

---

## TABLE OF CONTENT

| Section | Subsection | Page No |
|---|---|---|
| **Introduction** | | 1 |
| | 1.1 Background | 1 |
| | 1.1.1 Overview of the Domain or Area | 1 |
| | 1.1.2 Relevance and Importance of the Project | 1 |
| | 1.2 Motivation | 1 |
| | 1.2.1 Reasons for Undertaking the Project | 1 |
| | 1.2.2 Existing Problems or Gaps Addressed | 1 |
| **Problem Statement** | | 2 |
| | 2.1 Description of the Problem | 2 |
| | 2.1.1 Definition of the Problem or Challenge | 2 |
| | 2.1.2 Limitations or Inefficiencies in Current Solutions | 2 |
| **Objectives** | | 2 |
| | 3.1 Primary Objectives | 2 |
| | 3.1.1 Main Goals of the Project | 2 |
| | 3.2 Secondary Objectives | 2 |
| | 3.2.1 Additional Goals Complementing the Primary Objectives | 2 |
| **Scope of the Project** | | 2-3 |
| | 4.1 Scope | 2-3 |
| | 4.1.1 Boundaries of the Project | 2-3 |
| | 4.1.2 Inclusions and Exclusions | 2-3 |
| **Methodology** | | 3 |
| | 5.1 Description | 3 |
| | 5.1.1 Approach and Methods Used for the Project | 3 |
| **System Design** | | 3-4 |
| | 6.1 Architecture | 3-4 |
| | 6.1.1 Overall Architecture of the System or Solution | 3-4 |
| | 6.1.2 Diagrams (if necessary) | 4 |
| | 6.2 Components | 4 |
| | 6.2.1 Hardware Components | 4 |
| | 6.2.2 Software Components | 4 |
| **Development Process** | | 5 |
| | 7.1 Technology Stack | 5 |
| | 7.1.1 Technologies and Programming Languages Used | 5 |
| | 7.1.2 Tools and Frameworks Employed | 5 |
| | 7.2 AI/ML Integration (if applicable) | 5 |
| | 7.2.1 Description of AI/ML Techniques Implemented | 5 |
| **Implementation Steps** | | 5-6 |
| | 8.1 Phase 1 | 5 |
| | 8.1.1 Description: e.g., Requirement Analysis, System Design | 5 |
| | 8.2 Phase 2 | 6 |
| | 8.2.1 Description: e.g., Development, Integration | 6 |
| | 8.3 Phase 3 | 6 |
| | 8.3.1 Description: e.g., Testing, Deployment | 6 |
| **Testing Methodology** | | 6 |
| | 9.1 Types of Testing | 6 |
| | 9.1.1 Unit Testing | 6 |
| | 9.1.2 Integration Testing | 6 |
| | 9.1.3 User Acceptance Testing | 6 |
| **Expected Outcomes** | | 6-7 |
| | 10.1 Summary of Anticipated Results and Benefits | 6-7 |
| **Deliverables** | | 8 |
| | 11.1 List of Tangible Outcomes | 8 |
| | 11.1.1 Working Prototype | 8 |
| | 11.1.2 Software Application | 8 |
| | 11.1.3 Report | 8 |
| **Impact** | | 8 |
| | 12.1 Benefits to Users | 8 |
| | 12.2 Addressing the Identified Problem | 8 |
| **Timeline** | | 9 |
| | 13.1 Graphical Project Plan in Tabular Format | 9 |
| | 13.1.1 Gantt Chart or Similar Visual Representation | 9 |
| **Project Plan** | | 9 |
| | 14.1 Timeline and Key Milestones | 9 |
| | 14.1.1 Key Phases and Deadlines | 9 |
| **Resources Required** | | 9-10 |
| | 15.1 Hardware | 9 |
| | 15.1.1 List of Necessary Hardware Resources | 9 |
| | 15.2 Software | 9 |
| | 15.2.1 List of Software Resources and Licenses | 9 |
| | 15.3 Human Resources | 10 |
| | 15.3.1 Additional Expertise or Team Members Required | 10 |
| **References** | | 11 |
| | 17.1 Literature | 11 |
| | 17.1.1 Research Papers and Sources | 11 |
| | 17.2 Tools and Technologies used | 11 |

---

# Project Synopsis Format

## ● Title of the Project
**Title:** SkillBridge AI: A GraphRAG-Based Career Intelligence Platform for Job Matching, ATS Resume Optimization, and AI-Driven Mock Interviews

---

## ● Introduction

**Background:** The global and Indian job markets are increasingly skill-driven, with employer requirements shifting faster than traditional career-guidance resources can track. Final-year engineering students typically rely on three disconnected tools during placement preparation: a job portal to find openings, a separate resume-formatting tool or template, and generic online material for interview preparation. None of these tools reason about the specific skills demanded by a specific job posting, and none connect a candidate's actual resume to the live job market. This project addresses that gap by building a single AI-driven platform that treats job-market data as a structured, queryable knowledge source rather than a static list of listings.

**Motivation:** Retrieval-Augmented Generation (RAG) and agentic Large Language Model (LLM) systems are now core skills sought in AI/ML and software engineering job postings, yet most student projects apply RAG only to static documents such as PDFs. This project is motivated by two goals: first, to build a genuinely useful tool that the project team and peers can use for their own placement preparation; and second, to apply a more advanced retrieval pattern, GraphRAG combined with an agentic reasoning loop, to a live, continuously changing dataset. Existing placement-preparation tools generally treat resume building, skill assessment, and interview practice as separate products; this project's core motivation is to unify them around one underlying knowledge graph of roles, skills, and companies, so that every recommendation the system makes is grounded in real, current job-market evidence rather than generic advice.

---

## ● Problem Statement

**Description of the Problem:** Students preparing for placements face three linked but unaddressed problems. First, job search platforms return listings but do not explain what skills are actually in demand for a role, or how those requirements are trending over time and location. Second, resume-building tools produce generically formatted documents that are not tailored to the specific skills a target job listing asks for, and most are not verified to be ATS (Applicant Tracking System) parseable. Third, interview preparation material is generic and not tied to the requirements of a specific role a student is applying for. Current solutions are limited because they operate on isolated, unstructured data (a single job description, a single resume) using simple keyword or similarity matching, and cannot reason across relationships such as "which of my missing skills are most frequently required together for this role" or "how has demand for this skill changed recently."

---

## ● Objectives (MAX 3)

### Primary Objectives:
I. Design and implement an agentic GraphRAG-based career intelligence system that ingests live job-market data into a combined knowledge graph and vector store, and answers reasoning-based queries about roles, required skills, and market trends.  
II. Build an integrated resume module that parses an uploaded resume, computes a fit score against a specific job listing selected by the user, identifies the skills the user is missing for that role, and generates an ATS-friendly resume tailored to that listing.

### Secondary Objectives:
I. Provide a skill-gap-to-learning-resource feature that links each identified missing skill to curated, free learning resources.  
II. Develop an AI-driven mock interview module that generates role-specific interview questions from the knowledge graph and evaluates the user's answers, with an optional speech-based interface layered on top of a text-based core.

---

## ● Scope of the Project

### Scope:
#### Included in scope:
- Job-market data ingestion via a legitimate, free job-listing API (Adzuna), scoped to a defined set of roles and Indian cities.
- A knowledge graph modelling relationships between roles, skills, companies, and time, combined with a vector store for semantic similarity matching.
- Resume upload/parsing, fit scoring against a selected job listing, skill-gap identification, and ATS-friendly resume generation tailored to that listing.
- A skill-gap-to-learning-resource recommendation feature using curated free resource links.
- A text-based AI mock interview module, with speech input/output (speech-to-text and text-to-speech) added as a later-phase enhancement.

#### Excluded from scope:
- Direct scraping of platforms such as LinkedIn or Naukri, which prohibit automated scraping in their terms of service; all job data is sourced through a permitted API.
- Any guarantee of job placement or interview outcomes; the system provides preparation assistance, not a certified ATS-compliance guarantee or recruitment service.
- Coverage limited to the roles, cities, and volume of postings available within the free tier of the chosen job-data API.

---

## ● Methodology

The project follows an iterative, phase-wise development methodology (Agile-inspired sprints) across three implementation phases described in Section 8. The core technical methodology combines two retrieval strategies: 
1. **GraphRAG**, where job-market entities (roles, skills, companies) and their relationships are modelled explicitly in a graph database so the system can answer relationship and trend questions that plain similarity search cannot; and 
2. **Vector-based semantic retrieval**, used for matching free-text resume content and job descriptions. 

An agentic orchestration layer (built with LangGraph) decides, for each user query, whether to query the graph, the vector store, or both, and then uses a locally hosted open-source LLM to synthesize a grounded, explainable answer. This hybrid approach is validated incrementally: each module (ingestion, graph, vector store, resume tools, agent, interview module) is built and tested independently before integration.

---

## ● System Design:

### a. Architecture:

#### Overall Architecture of the System:
The system follows a layered architecture: 
1. **Data-ingestion layer** that periodically pulls job postings and extracts structured skill/role information; 
2. **Storage layer** combining a knowledge graph (relationships) and a vector database (semantic embeddings) alongside a relational database (application data); 
3. **Intelligence layer** where an LLM-driven agent plans and executes retrieval steps across the graph and vector store; and 
4. **Application layer** (Django backend and web frontend) that exposes resume upload, fit scoring, ATS resume generation, skill-gap recommendations, and the mock interview module to the user.

#### Simplified Data Flow:
```
[ Job Data Ingestion ]
         ↓
[ Skill/Role Extraction ]
         ↓
[ Graph + Vector Store ]
         ↓
[ Agentic LLM Reasoning ]
         ↓
[ Django App (Resume, Interview, UI) ]
```

### b. Components:

#### Hardware Components
- Standard development laptops/desktops (minimum 8 GB RAM; 16 GB recommended if running the LLM locally).
- No specialised or dedicated GPU hardware is required, since a free-tier hosted inference API can substitute for local LLM execution where local hardware is insufficient.

#### Software Components
- **Backend framework:** Django and Django REST Framework.
- **Databases:** PostgreSQL (relational/application data), Neo4j (knowledge graph), Qdrant or ChromaDB (vector store).
- **NLP/ML libraries:** spaCy (NER), sentence-transformers (embeddings), Whisper (speech-to-text), Piper/Coqui TTS (text-to-speech).
- **LLM and agent orchestration:** an open-source LLM (Llama 3.1 or Qwen2.5) served via Ollama, orchestrated with LangGraph.
- **Resume generation:** python-docx and/or ReportLab for ATS-friendly document output.
- **Background task processing:** Celery with Redis for scheduled data ingestion and long-running AI tasks.

---

## ● Development Process:

### a. Technology Stack:

#### Technologies and Programming Languages Used
- **Python** is the primary language for the backend, data pipeline, and AI/ML components.
- **JavaScript/React (or Django templates)** is used for the frontend.
- **Cypher** is used as the query language for the Neo4j graph database.

#### Tools and Frameworks Employed
- Django, Django REST Framework, Celery, Redis
- Neo4j Community Edition, Qdrant/ChromaDB, PostgreSQL
- LangGraph, Ollama, spaCy, sentence-transformers, Whisper, Piper/Coqui TTS
- Adzuna Job Search API (free tier) for live job-market data
- Git/GitHub for version control; GitHub Actions for scheduled data-refresh jobs
- HuggingFace Spaces (free tier) for demo deployment

### b. AI/ML Integration (if applicable):

#### Description of AI/ML Techniques Implemented
- **Named Entity Recognition (NER)** to extract skills, roles, and qualifications from job postings and resumes.
- **Sentence embeddings and vector similarity search** for resume-to-job semantic matching.
- **Knowledge graph construction and Cypher-based graph traversal** for relationship and trend reasoning (GraphRAG).
- **Agentic orchestration (LangGraph)** enabling the LLM to plan multi-step retrieval across the graph and vector store.
- **LLM-based generation** for ATS resume drafting, skill-gap explanation, and interview question generation/answer evaluation.
- **Speech-to-text (Whisper) and text-to-speech synthesis** for the optional voice-based mock interview mode.

---

## ● Implementation Steps:

### a. Phase 1:
**Description:** Requirement analysis, knowledge-graph schema design, Adzuna API integration and scheduled ingestion pipeline, vector store setup, and initial Django project scaffolding.

### b. Phase 2:
**Description:** Development of the agentic query system (LangGraph agent over the graph and vector store), resume parsing and fit-scoring, ATS-friendly resume generation tailored to a selected job listing, skill-gap-to-learning-resource mapping, and frontend integration.

### c. Phase 3:
**Description:** Text-based AI mock interview module (question generation and answer evaluation grounded in the knowledge graph), integration testing across all modules, optional speech-based interview mode (Whisper + TTS) as a stretch enhancement, deployment to a free-tier hosting environment, and final documentation.

---

## ● Testing Methodology:

### Types of Testing:

#### Unit Testing
Individual modules (skill extraction, embedding generation, graph queries, resume parsing, ATS resume generation) are tested in isolation using Django's test framework and pytest, with sample job postings and sample resumes as fixtures.

#### Integration Testing
End-to-end flows are tested across module boundaries: ingestion to graph/vector store, agent query to LLM response, resume upload to fit score and ATS resume output, and interview question generation to answer evaluation.

#### User Acceptance Testing
The platform is tested with real resumes and real job-search intentions from peer CSE students, who evaluate the relevance of the fit score, the usefulness of identified skill gaps, the readability/ATS-friendliness of generated resumes, and the quality of mock interview questions and feedback.

---

## ● Expected Outcomes

### Summary of Anticipated Results and Benefits
The project is expected to produce a working, demonstrable platform that ingests live job-market data, answers reasoning-based career queries grounded in a knowledge graph, tailors a candidate's resume to a specific job listing with a measurable fit score, identifies concrete skill gaps with linked learning resources, and conducts a role-specific mock interview. The project is also expected to demonstrate practical, working knowledge of agentic RAG/GraphRAG system design, an increasingly sought-after skill set in AI/ML engineering roles, in addition to the applied outcome of a genuinely usable placement-preparation tool for the team and their peers.

---

## ● Deliverables:

### List of Tangible Outcomes:
1. **Working Prototype:** A functioning end-to-end system covering job-market querying, resume fit scoring, ATS resume generation, skill-gap recommendations, and a text-based mock interview module.
2. **Software Application:** A deployed Django-based web application with a documented codebase hosted on a version-controlled repository.
3. **Report:** A complete project report documenting the architecture, knowledge-graph schema, methodology, testing results, and evaluation of the system against its stated objectives.

---

## ● Impact:

### Benefits to Users
Students gain a single tool that replaces three disconnected activities (job search, resume tailoring, interview preparation) with one that reasons about their specific gaps against specific, current job listings, rather than offering generic advice.

### Addressing the Identified Problem
By grounding every recommendation, resume, and interview question in a live knowledge graph built from real job postings, the system directly addresses the fragmentation and genericness identified in the problem statement, giving users evidence-based, role-specific guidance instead of static templates or generic keyword-matched suggestions.

---

## ● Timeline

| Duration | Activity / Milestone |
|---|---|
| **Weeks 1-2** | Requirement analysis, knowledge-graph schema design, Django project setup |
| **Weeks 3-4** | Adzuna ingestion pipeline, skill/role extraction, Neo4j + vector store integration |
| **Weeks 5-6** | Agentic query system (LangGraph agent), resume parsing, fit scoring |
| **Weeks 7-8** | ATS resume generation, skill-gap-to-resource mapping, frontend integration |
| **Weeks 9-10** | Text-based mock interview module, integration testing |
| **Weeks 11-12** | Optional speech-based interview mode, user acceptance testing, deployment |
| **Weeks 13-14** | Bug fixing, documentation, final report and demo preparation |

---

## ● Project Plan:

### Timeline and Key Milestones

#### Key Phases and Deadlines:
- **Milestone 1 (end of Week 4):** Data pipeline and knowledge graph operational with sample data.
- **Milestone 2 (end of Week 8):** Resume fit-scoring and ATS resume generation functional against live job listings.
- **Milestone 3 (end of Week 10):** Mock interview module functional in text mode.
- **Milestone 4 (end of Week 14):** Fully integrated, tested, and deployed system with completed documentation.

#### Team Responsibilities:
- **Md. Zaid Alam:** Leads the data ingestion pipeline, knowledge-graph schema and construction, and backend infrastructure (Django, Celery, deployment).
- **Aquib Javed:** Leads the agentic LLM/RAG layer, resume parsing and ATS resume generation, skill-gap recommendation logic, and the mock interview module.
- **Both members:** Collaborate on frontend integration, testing, and documentation.

---

## ● Resources Required:

### Hardware
#### List of Necessary Hardware Resources:
- Personal laptops/desktops for development (minimum 8 GB RAM, 16 GB recommended).
- Stable internet connectivity for API access and version control.

### Software
#### List of Software Resources and Licenses:
- All software used is free and open-source: Python, Django, PostgreSQL, Neo4j Community Edition, Qdrant/ChromaDB, Ollama, spaCy, sentence-transformers, Whisper, Piper/Coqui TTS, LangGraph, Git.
- Free-tier third-party services: Adzuna Job Search API, GitHub Actions, HuggingFace Spaces.

### Human Resources
#### Additional Expertise or Team Members Required:
The project is executed by the two-member team named on the cover page (Md. Zaid Alam and Aquib Javed), under the guidance of the assigned project supervisor. Periodic consultation with faculty members with expertise in machine learning and database design is anticipated during the knowledge-graph design and agent-evaluation stages.

---

## ● References

### Literature:
#### Research Papers and Sources:
- Lewis, P. et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," *NeurIPS*, 2020.
- Edge, D. et al., "From Local to Global: A Graph RAG Approach to Query-Focused Summarization," *Microsoft Research*, 2024.
- Yao, S. et al., "ReAct: Synergizing Reasoning and Acting in Language Models," *ICLR*, 2023.
- Radford, A. et al., "Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)," *OpenAI*, 2022.

### Tools and Technologies:
- **Django & Django REST Framework** — https://www.djangoproject.com/
- **Neo4j Community Edition** — https://neo4j.com/
- **Qdrant** — https://qdrant.tech/ | **ChromaDB** — https://www.trychroma.com/
- **LangGraph** — https://www.langchain.com/langgraph
- **Ollama** — https://ollama.com/
- **spaCy** — https://spacy.io/ | **sentence-transformers** — https://www.sbert.net/
- **Adzuna Developer API** — https://developer.adzuna.com/
