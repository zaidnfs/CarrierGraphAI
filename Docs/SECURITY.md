# Security Requirements — SkillBridge AI

## Overview

Security is built into the project from day one, not bolted on before deployment. Every developer and AI agent must follow these requirements during implementation.

---

## Authentication

| Requirement | Details |
|---|---|
| All private routes require authentication | Dashboard, Resume, Interview, Settings — all behind auth |
| Passwords are never stored in plain text | Use Django's built-in password hashing (PBKDF2 / Argon2) |
| Login rate limiting | Max 5 failed attempts per minute per IP. Lock for 5 minutes after |
| Session/token expiry | Tokens expire after 24 hours. Require re-authentication |
| Logout invalidates token | Server-side token invalidation, not just client-side deletion |
| Password reset requires email verification | No password reset via direct URL manipulation |

---

## Authorization

| Requirement | Details |
|---|---|
| Users can only access their own resources | Resume, interview sessions, saved queries — all scoped to the authenticated user |
| Object-level permissions | Every API endpoint that returns user data must verify `request.user == resource.owner` |
| Admin access is separate | Admin panel protected with strong credentials, not accessible to regular users |
| No horizontal privilege escalation | Changing user ID in request must not grant access to another user's data |

---

## Secrets & Environment Variables

| Requirement | Details |
|---|---|
| Never commit secrets to Git | `.env`, `.env.local` are in `.gitignore` |
| `.env.example` contains only key names | No real values in `.env.example` |
| All secrets loaded from environment variables | `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `NEO4J_AUTH`, `DATABASE_URL`, `SECRET_KEY`, `OLLAMA_BASE_URL` |
| Django `SECRET_KEY` is unique per environment | Development and production use different keys |
| `DEBUG = False` in production | Never deploy with Django debug mode enabled |
| `ALLOWED_HOSTS` is configured in production | No wildcard `*` in production settings |

---

## Database Security

| Requirement | Details |
|---|---|
| PostgreSQL connections use credentials from environment | No hardcoded connection strings |
| Neo4j uses parameterized Cypher queries | Never concatenate user input into Cypher strings |
| Database users have minimal privileges | Application DB user has only the permissions it needs |
| Backups are configured for production | PostgreSQL backup schedule before launch |

---

## Input Validation

| Requirement | Details |
|---|---|
| All API input validated via DRF serializers | Never trust raw `request.data` without validation |
| Email validation on signup | Valid email format required |
| Password strength validation | Minimum 8 characters, not entirely numeric, not a common password |
| Text fields have max length limits | Prevent oversized payloads |
| Numeric fields have range validation | Prevent unreasonable values |
| Query strings are sanitized | No raw user input in database queries or LLM prompts |

---

## File Upload Security

| Requirement | Details |
|---|---|
| Allowed file types | PDF (`.pdf`) and DOCX (`.docx`) only |
| Maximum file size | 10 MB per file |
| Filename sanitization | Strip path traversal characters (`../`, `\`) |
| File content validation | Verify file magic bytes match declared extension |
| Upload directory is not publicly accessible | Uploaded files served only through authenticated Django views |
| Virus/malware scanning | Optional: integrate ClamAV for production deployments |

---

## API Security

| Requirement | Details |
|---|---|
| All API endpoints require authentication | Except signup, login, and public health check |
| CSRF protection enabled | Django CSRF middleware active on all form submissions |
| CORS configured restrictively | Only allow requests from the frontend domain. During development, allow `http://localhost:5173` (Vite dev server). In production, allow only the deployed frontend URL |
| Rate limiting on sensitive endpoints | Login: 5/min, Resume upload: 10/min, LLM queries: 20/min |
| Request body size limit | 10 MB max |
| No sensitive data in URLs | Use POST body for credentials, tokens, and PII |
| API responses do not expose internal errors | Return generic error messages; log detailed errors server-side |

---

## LLM / AI Security

| Requirement | Details |
|---|---|
| System prompts are not exposed to users | LLM output is sanitized before display |
| User input to LLM is sanitized | Strip prompt injection attempts from resume text and query inputs |
| LLM outputs are treated as untrusted | Validate and sanitize before rendering in HTML |
| PII in LLM logs is redacted | Log prompts and responses for debugging but redact names, emails, phone numbers |
| LLM failures do not crash the application | Timeout and error handling with user-friendly fallback messages |

---

## Transport Security

| Requirement | Details |
|---|---|
| HTTPS in production | All traffic over TLS |
| HSTS header enabled | `Strict-Transport-Security` in production |
| Secure cookies | `SESSION_COOKIE_SECURE = True`, `CSRF_COOKIE_SECURE = True` in production |
| No mixed content | All resources loaded over HTTPS |

---

## Dependency Security

| Requirement | Details |
|---|---|
| Pin dependency versions | Use exact versions in `requirements.txt` |
| Audit dependencies regularly | `pip-audit` or `safety check` before each release |
| No unnecessary dependencies | Remove unused packages |
| Review new dependencies before adding | Check maintenance status, known vulnerabilities, license |

---

## Security Checklist (Pre-Deployment)

- [ ] All secrets in environment variables, not in code
- [ ] `.env` is in `.gitignore`
- [ ] `DEBUG = False` in production settings
- [ ] `ALLOWED_HOSTS` configured
- [ ] `SECRET_KEY` is unique and strong
- [ ] CSRF middleware active
- [ ] CORS configured for frontend domain only
- [ ] Authentication on all private endpoints
- [ ] Authorization checks on all user-owned resources
- [ ] File upload validation (type, size, content)
- [ ] Input validation on all API endpoints
- [ ] Rate limiting on login, upload, and LLM endpoints
- [ ] Neo4j queries are parameterized
- [ ] LLM outputs sanitized before rendering
- [ ] HTTPS enabled in production
- [ ] Secure cookie flags set
- [ ] Dependencies audited for vulnerabilities
- [ ] No PII in logs (or PII is redacted)
- [ ] Error responses do not expose internals
