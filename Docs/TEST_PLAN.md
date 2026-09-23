# Test Plan — SkillBridge AI

## Overview

This document defines what "working" means for every module of SkillBridge AI. It serves as the testing checklist during development and before deployment.

---

## Testing Strategy

| Level | Tool | Scope |
|---|---|---|
| **Unit** | pytest + Django TestCase | Individual functions, services, utilities |
| **Integration** | pytest + Django TestCase | Cross-service flows, API endpoints, database interactions |
| **End-to-End** | Playwright | Full user flows through the React frontend UI |
| **User Acceptance** | Manual with peer testers | Real resumes, real job searches, real interview sessions |

---

## Unit Tests

### Accounts / Authentication

| # | Test Case | Expected Result |
|---|---|---|
| U-01 | Signup with valid email and password | User created, 201 response |
| U-02 | Signup with duplicate email | 400 error, descriptive message |
| U-03 | Signup with weak password | 400 error, password validation message |
| U-04 | Login with valid credentials | Token returned, 200 response |
| U-05 | Login with invalid credentials | 401 error, generic "invalid credentials" message |
| U-06 | Access protected endpoint without token | 401 error |
| U-07 | Access protected endpoint with expired token | 401 error |

### Adzuna Client

| # | Test Case | Expected Result |
|---|---|---|
| U-08 | Fetch jobs with valid API credentials | List of job postings returned |
| U-09 | Fetch jobs with invalid API credentials | Graceful error, no crash |
| U-10 | Fetch jobs with network timeout | Timeout handled, retry or error returned |
| U-11 | Parse Adzuna API response into internal model | All fields correctly mapped |

### NER Service (spaCy)

| # | Test Case | Expected Result |
|---|---|---|
| U-12 | Extract skills from a job description containing "Python, Django, PostgreSQL" | Returns ["Python", "Django", "PostgreSQL"] |
| U-13 | Extract role from a job title "Senior Backend Developer" | Returns normalized role |
| U-14 | Handle job description with no identifiable skills | Returns empty list, no error |
| U-15 | Handle empty string input | Returns empty result, no crash |

### Embedding Service

| # | Test Case | Expected Result |
|---|---|---|
| U-16 | Generate embedding for a job description | Returns vector of expected dimensions |
| U-17 | Generate embedding for empty string | Handles gracefully |
| U-18 | Two similar job descriptions produce similar embeddings | Cosine similarity > 0.7 |

### Graph Service (Neo4j)

| # | Test Case | Expected Result |
|---|---|---|
| U-19 | Create a Skill node | Node exists in Neo4j |
| U-20 | Create a Role node | Node exists in Neo4j |
| U-21 | Create a REQUIRES relationship | Relationship exists between JobPosting and Skill |
| U-22 | Query skills for a role | Returns correct skill list |
| U-23 | Query with parameterized Cypher (no injection) | Parameterized query executes safely |
| U-24 | Handle Neo4j connection failure | Graceful error, no crash |

### Vector Service (Qdrant/ChromaDB)

| # | Test Case | Expected Result |
|---|---|---|
| U-25 | Store an embedding with metadata | Embedding stored and retrievable |
| U-26 | Similarity search returns top-k results | Correct number of results returned |
| U-27 | Similarity search with threshold filtering | Low-similarity results excluded |
| U-28 | Handle vector store connection failure | Graceful error |

### Resume Service

| # | Test Case | Expected Result |
|---|---|---|
| U-29 | Parse PDF resume, extract text | Text content extracted |
| U-30 | Parse DOCX resume, extract text | Text content extracted |
| U-31 | Extract skills from resume text | Skill list returned |
| U-32 | Compute fit score: resume with all matching skills | Score ≥ 80 |
| U-33 | Compute fit score: resume with no matching skills | Score ≤ 20 |
| U-34 | Compute fit score: resume with partial match | Score between 40–70 |
| U-35 | Generate ATS resume (DOCX output) | Valid DOCX file generated |
| U-36 | Handle corrupted PDF upload | Error returned, no crash |
| U-37 | Handle oversized file upload | Rejected with size limit message |

### LLM Service

| # | Test Case | Expected Result |
|---|---|---|
| U-38 | Send prompt to Ollama, receive response | Text response returned |
| U-39 | Handle Ollama timeout | Timeout error with fallback message |
| U-40 | Handle Ollama server not running | Connection error handled gracefully |
| U-41 | Response does not leak system prompt | System prompt not visible in output |

---

## Integration Tests

### Data Pipeline (End-to-End Ingestion)

| # | Test Case | Expected Result |
|---|---|---|
| I-01 | Adzuna fetch → NER extract → Graph populated | Job posting node and skill nodes exist in Neo4j with relationships |
| I-02 | Adzuna fetch → Embedding → Vector store populated | Embeddings searchable in vector store |
| I-03 | Celery scheduled task fires and completes | Task logged as successful |

### Agent Query System

| # | Test Case | Expected Result |
|---|---|---|
| I-04 | User query about skill demand → Agent queries graph → Returns grounded answer | Answer references real skills and roles from graph |
| I-05 | User query about job description similarity → Agent queries vector store | Returns semantically similar job postings |
| I-06 | User query requiring both graph and vector retrieval | Agent plans multi-step retrieval, returns combined answer |

### Resume Analysis Flow

| # | Test Case | Expected Result |
|---|---|---|
| I-07 | Upload resume → Parse → Select job → Fit score returned via API | Score and skill breakdown returned |
| I-08 | Upload resume → Generate ATS resume → Download DOCX | Valid DOCX downloaded with tailored content |

### Mock Interview Flow

| # | Test Case | Expected Result |
|---|---|---|
| I-09 | Select role → Generate questions from graph → Return questions via API | Role-specific questions returned |
| I-10 | Submit answer → Evaluate with LLM → Return feedback via API | Constructive feedback returned |

---

## End-to-End Tests (User Flows)

| # | Flow | Steps |
|---|---|---|
| E-01 | **Full signup-to-dashboard** | Open app → Signup → Redirected to Dashboard → Market insights displayed |
| E-02 | **Login and query** | Login → Enter job market query → See grounded response |
| E-03 | **Resume analysis** | Login → Upload resume → Browse jobs → Select listing → See fit score → See missing skills → Download ATS resume |
| E-04 | **Mock interview** | Login → Select role → Start interview → Answer questions → See feedback → See session summary |
| E-05 | **Logout and access control** | Logout → Attempt to access Dashboard → Redirected to Login |

---

## Responsive Testing

Test all pages at these breakpoints:

| Breakpoint | Width | Target |
|---|---|---|
| Mobile | 375px | Phone (iPhone SE) |
| Tablet | 768px | iPad mini |
| Desktop | 1024px | Laptop |
| Wide | 1440px | Desktop monitor |

### Check at each breakpoint:
- [ ] Navigation is usable (sidebar collapses, bottom nav appears)
- [ ] Cards stack vertically on mobile
- [ ] Forms are full-width on mobile
- [ ] Text is readable without horizontal scrolling
- [ ] Modals fit within viewport
- [ ] Touch targets ≥ 44px on mobile

---

## Accessibility Testing

- [ ] All pages navigable with keyboard only (Tab, Enter, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast ≥ 4.5:1 (use browser dev tools audit)
- [ ] All images have alt text
- [ ] All form inputs have associated labels
- [ ] Screen reader announces page changes and dynamic content
- [ ] ARIA labels on icon-only buttons

---

## Performance Targets

| Metric | Target |
|---|---|
| Page load (first contentful paint) | < 2 seconds |
| API response (non-LLM endpoints) | < 500ms |
| LLM query response | < 15 seconds |
| Resume parsing | < 5 seconds |
| Fit score computation | < 3 seconds |
| ATS resume generation | < 10 seconds |

---

## User Acceptance Testing

Recruit 3–5 peer CSE students to test with their real resumes and real job-search intentions.

**Evaluate:**
- [ ] Is the fit score meaningful and believable?
- [ ] Are the identified skill gaps accurate?
- [ ] Is the ATS resume well-formatted and professional?
- [ ] Are the mock interview questions relevant to the role?
- [ ] Is the interview feedback constructive and specific?
- [ ] Is the overall UI intuitive without explanation?
