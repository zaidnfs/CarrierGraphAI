# Development Rules — SkillBridge AI

## Purpose

This file is the AI coding rulebook for SkillBridge AI. Every AI agent and developer working on this project must follow these rules without exception.

---

## Before Writing Any Code

1. **Read the relevant project documentation first.**
   - Always read `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `TASK.md` before implementing a feature.
   - Check `MEMORY.md` for current project state.
   - Check `DECISIONS.md` before proposing architectural changes.
2. **Inspect existing implementation.** Search the codebase for related code before creating new files.
3. **Reuse existing components and services.** Do not duplicate logic that already exists.
4. **Plan before implementing.** For tasks touching more than 3 files, explain the plan before writing code.
5. **Ask for clarification if requirements are ambiguous.** Do not assume.

---

## General Rules

- Use **Python 3.11+** for all backend code.
- Use **TypeScript** for all frontend code. The frontend uses React + Vite + shadcn/ui.
- Write **type hints** on all Python function signatures.
- Keep functions **small and focused** — one function does one thing.
- Do **not** modify unrelated files when implementing a feature.
- Do **not** remove or modify existing comments and docstrings unless they are incorrect.
- Use **descriptive variable names** — no single-letter variables except in list comprehensions and lambda functions.
- Follow **PEP 8** for Python code.
- Maximum line length: **120 characters**.
- Use **f-strings** for string formatting, not `.format()` or `%`.

---

## Architecture Rules

- **UI components must not contain database logic.** Views call services; services handle data access.
- **Database operations belong in `services/`.** Django views/serializers never query Neo4j or Qdrant directly.
- **Authentication must be verified server-side.** Every protected endpoint checks auth via Django middleware or DRF permissions.
- **Reusable UI goes in `components/`.** Page-specific UI stays in `pages/`.
- **Business logic is separate from UI.** The intelligence layer (agent, LLM, NER) is accessed only through `services/`.
- **LLM prompts live in versioned template files**, not hardcoded in Python functions.
- **Background tasks use Celery.** No long-running operations in Django request/response cycle.
- **All secrets are loaded from environment variables.** Never hardcode API keys, database passwords, or tokens.

---

## Django-Specific Rules

- Use **Django REST Framework** for all API endpoints.
- Use **serializers** for input validation — never validate manually in views.
- Use **Django's ORM** for PostgreSQL queries. Raw SQL only when the ORM cannot express the query.
- Use **class-based views** (APIView or ViewSet) for API endpoints.
- All database models must have:
  - `created_at` and `updated_at` timestamps.
  - `__str__` method.
  - Proper `Meta` class with `ordering` and `verbose_name`.
- Migrations must be committed. Never use `--fake` without documenting in DECISIONS.md.
- Use `select_related` and `prefetch_related` to prevent N+1 queries.

---

## Neo4j / Graph Rules

- All Cypher queries go through `graph_service.py`. No Cypher in views.
- Use **parameterized queries** — never concatenate user input into Cypher strings.
- Every graph operation must handle connection failures gracefully.
- Document new node labels and relationship types in `ARCHITECTURE.md`.

---

## LLM / AI Rules

- All LLM calls go through `llm_service.py`. No direct Ollama calls from views.
- Every LLM prompt must have a **system message** defining role and constraints.
- Set **temperature and max_tokens** explicitly — never rely on defaults.
- All LLM outputs displayed to users must be **sanitized** (no prompt leakage, no raw JSON dumps).
- Log LLM inputs and outputs for debugging (redact any PII).
- Handle LLM timeouts and failures with user-friendly fallback messages.

---

## UI / Frontend Rules

- Follow `DESIGN.md` for all visual decisions — colors, typography, spacing, components.
- **Use shadcn/ui components** as the base for all standard UI elements (Button, Card, Input, Badge, Dialog, etc.).
- **Use React Bits** ([reactbits.dev](https://reactbits.dev)) for animated micro-interactions, text effects, and interactive components.
- **Use Libraries.dev** ([libraries.dev](https://libraries.dev)) effects (Beam, Orb, Gooey, Metal) for premium visual polish.
- **Do not install alternative full component libraries** (MUI, Chakra, Ant Design, etc.) — shadcn/ui + React Bits + Libraries.dev cover all needs.
- Use the **`cn()` utility** for conditional class merging — never build manual className strings.
- **All API calls go through `services/`** — no direct `fetch()` or `axios` calls in components.
- Use **React hooks** (`useState`, `useEffect`, custom hooks in `hooks/`) for state management.
- **Every page must have**: loading state, empty state, error state.
- **Mobile responsive** — test at 375px, 768px, 1024px, 1440px.
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`).
- All form inputs must have labels and validation messages.
- All interactive elements must be keyboard accessible.
- Images must have `alt` text.
- Do not use inline styles. All styling goes through Tailwind CSS utility classes or CSS files.

---

## Security Rules

- **Never expose API keys or secrets** in client-side code.
- **Validate all user input** on the server side. Client-side validation is supplementary, not sufficient.
- **Verify authorization** — users can only access resources they own.
- **Sanitize file uploads** — validate file type, file size, and filename.
- **Use CSRF protection** on all forms.
- **Use HTTPS** in production.
- **Rate-limit** sensitive endpoints (login, resume upload, LLM queries).

---

## Testing Rules

- Write tests for all new services and API endpoints.
- Use **pytest** and **Django's test framework**.
- Tests must be independent — no test should depend on another test's state.
- Use **fixtures** for test data. Do not hardcode test data in test functions.
- Run tests before marking a task complete.
- Fix failing tests before moving to the next feature.
- Do not disable or skip tests without documenting why.

---

## Git Rules

- Make **small, focused commits** — one commit per logical change.
- Use **descriptive commit messages** following this format:
  ```
  type: short description
  
  Longer explanation if needed.
  ```
  Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`
- Use **branches** for features: `feature/job-ingestion`, `feature/resume-scoring`, `fix/mobile-navbar`.
- Never commit `.env`, `__pycache__`, `node_modules`, or IDE config files.
- Never force-push to `main`.
- Review diff before committing.

---

## Documentation Rules

- Update `TASK.md` when starting and completing tasks.
- Update `MEMORY.md` when project state changes.
- Update `DECISIONS.md` when making architectural decisions.
- Update `ARCHITECTURE.md` when adding new services, models, or integrations.
- Keep `README.md` accurate — it should always describe how to run the current project.
- Add docstrings to all public functions and classes.

---

## What NOT to Do

- ❌ Do not build the entire application in one prompt.
- ❌ Do not skip testing.
- ❌ Do not refactor unrelated code while fixing a bug.
- ❌ Do not add features not in the current task or PRD.
- ❌ Do not change the database schema without updating ARCHITECTURE.md and DECISIONS.md.
- ❌ Do not remove existing functionality without explicit approval.
- ❌ Do not use deprecated libraries or patterns.
- ❌ Do not store user passwords in plain text.
- ❌ Do not ignore errors — handle them or propagate them with context.
