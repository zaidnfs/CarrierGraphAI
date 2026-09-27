"""
Named Entity Recognition (NER) and entity extraction service for SkillBridge AI.
Extracts technical skills, soft skills, and normalized job roles from raw text
using a comprehensive technical taxonomy, pattern matchers, and spaCy NLP pipeline.
"""
import logging
import re
from typing import Any

logger = logging.getLogger(__name__)

# Structured skill taxonomy by category
SKILL_TAXONOMY: dict[str, list[str]] = {
    "Languages": [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C", "Go",
        "Rust", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "HTML", "CSS", "R",
        "Scala", "Dart", "Shell", "Bash", "PowerShell", "Perl",
    ],
    "Frameworks": [
        "Django", "FastAPI", "Flask", "React", "React Native", "Angular", "Vue",
        "Next.js", "Nuxt.js", "Node.js", "Express", "Express.js", "Spring Boot",
        "Spring", "ASP.NET", ".NET Core", ".NET", "Ruby on Rails", "Rails",
        "Laravel", "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Pandas",
        "NumPy", "Tailwind CSS", "Tailwind", "Bootstrap", "GraphQL", "Celery",
        "Redux", "Flutter",
    ],
    "Databases": [
        "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "Neo4j",
        "Qdrant", "ChromaDB", "Elasticsearch", "Cassandra", "DynamoDB",
        "Oracle", "SQLite", "MariaDB", "Snowflake", "BigQuery", "Firebase",
    ],
    "Cloud & DevOps": [
        "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud",
        "Docker", "Kubernetes", "Terraform", "Ansible", "CI/CD", "Jenkins",
        "GitHub Actions", "GitLab CI", "Linux", "Nginx", "Apache", "Kafka",
        "RabbitMQ", "Prometheus", "Grafana", "Helm",
    ],
    "AI & Data Science": [
        "Machine Learning", "Deep Learning", "Natural Language Processing",
        "NLP", "Computer Vision", "Generative AI", "Large Language Models",
        "LLM", "LangChain", "LangGraph", "Retrieval-Augmented Generation",
        "RAG", "Data Analysis", "Data Visualization", "Data Mining",
    ],
    "Methodologies & Tools": [
        "REST API", "RESTful API", "REST", "Microservices", "Agile", "Scrum",
        "Kanban", "Git", "GitHub", "GitLab", "Jira", "TDD", "Clean Code",
        "System Design", "Object-Oriented Programming", "OOP",
    ],
    "Soft Skills": [
        "Problem Solving", "Communication", "Teamwork", "Leadership",
        "Critical Thinking", "Collaboration", "Adaptability",
    ],
}

# Mapping of keywords to canonical roles
ROLE_CANONICAL_MAP: dict[str, str] = {
    "backend developer": "Backend Developer",
    "backend engineer": "Backend Developer",
    "back-end developer": "Backend Developer",
    "back end developer": "Backend Developer",
    "server engineer": "Backend Developer",
    "python developer": "Backend Developer",
    "django developer": "Backend Developer",
    "java developer": "Backend Developer",
    "frontend developer": "Frontend Developer",
    "frontend engineer": "Frontend Developer",
    "front-end developer": "Frontend Developer",
    "front end developer": "Frontend Developer",
    "ui developer": "Frontend Developer",
    "react developer": "Frontend Developer",
    "angular developer": "Frontend Developer",
    "full stack software engineer": "Full Stack Developer",
    "full-stack software engineer": "Full Stack Developer",
    "full stack developer": "Full Stack Developer",
    "fullstack developer": "Full Stack Developer",
    "full stack engineer": "Full Stack Developer",
    "fullstack engineer": "Full Stack Developer",
    "full-stack developer": "Full Stack Developer",
    "full-stack engineer": "Full Stack Developer",
    "full stack": "Full Stack Developer",
    "fullstack": "Full Stack Developer",
    "full-stack": "Full Stack Developer",
    "backend": "Backend Developer",
    "back-end": "Backend Developer",
    "frontend": "Frontend Developer",
    "front-end": "Frontend Developer",
    "data scientist": "Data Scientist",
    "data science": "Data Scientist",
    "machine learning engineer": "Machine Learning Engineer",
    "ml engineer": "Machine Learning Engineer",
    "ai engineer": "Machine Learning Engineer",
    "deep learning engineer": "Machine Learning Engineer",
    "data engineer": "Data Engineer",
    "big data engineer": "Data Engineer",
    "etl developer": "Data Engineer",
    "devops engineer": "DevOps Engineer",
    "site reliability engineer": "DevOps Engineer",
    "sre": "DevOps Engineer",
    "cloud engineer": "DevOps Engineer",
    "infrastructure engineer": "DevOps Engineer",
    "mobile app developer": "Mobile Developer",
    "mobile developer": "Mobile Developer",
    "android developer": "Mobile Developer",
    "ios developer": "Mobile Developer",
    "flutter developer": "Mobile Developer",
    "mobile": "Mobile Developer",
    "android": "Mobile Developer",
    "ios": "Mobile Developer",
    "flutter": "Mobile Developer",
    "qa engineer": "QA Engineer",
    "software test engineer": "QA Engineer",
    "security engineer": "Security Engineer",
    "cybersecurity engineer": "Security Engineer",
    "software engineer": "Software Engineer",
    "software developer": "Software Engineer",
}


class NERService:
    """
    Skill and Role entity extraction service.
    Combines rule-based pattern matching with boundary awareness
    and spaCy NLP tokenizer pipeline.
    """

    def __init__(self, spacy_model_name: str = "en_core_web_sm"):
        self.model_name = spacy_model_name
        self._nlp = None
        self._skill_lookup: dict[str, dict[str, str]] = {}
        self._regex_patterns: list[tuple[re.Pattern, str, str]] = []
        self._compile_patterns()

    def _compile_patterns(self) -> None:
        """
        Pre-compile regex matchers with appropriate word boundaries.
        Special care is taken for symbols like C++, C#, .NET, and short names like Go, R.
        """
        for category, skills in SKILL_TAXONOMY.items():
            for skill in skills:
                norm = skill.lower()
                self._skill_lookup[norm] = {"name": skill, "category": category}

                # Boundary logic based on characters
                if skill in ("C++", "c++"):
                    pattern = re.compile(r"(?<!\w)C\+\+(?!\w)", re.IGNORECASE)
                elif skill in ("C#", "c#"):
                    pattern = re.compile(r"(?<!\w)C\#(?!\w)", re.IGNORECASE)
                elif skill in (".NET", ".NET Core"):
                    escaped = re.escape(skill)
                    pattern = re.compile(rf"(?<!\w){escaped}(?!\w)", re.IGNORECASE)
                elif skill in ("Go", "R", "C"):
                    # Strict uppercase with word boundaries for 1-2 letter ambiguous language tokens
                    pattern = re.compile(rf"\b{re.escape(skill)}\b")
                else:
                    escaped = re.escape(skill)
                    pattern = re.compile(rf"\b{escaped}\b", re.IGNORECASE)

                self._regex_patterns.append((pattern, skill, category))

    @property
    def nlp(self) -> Any:
        """
        Lazy load spaCy pipeline. Falls back to blank English tokenizer
        if model weights are not pre-downloaded.
        """
        if self._nlp is None:
            try:
                import spacy

                try:
                    self._nlp = spacy.load(self.model_name)
                    logger.info(f"Loaded spaCy model: {self.model_name}")
                except (OSError, ImportError):
                    logger.warning(
                        f"spaCy model '{self.model_name}' not available. Falling back to spacy.blank('en')"
                    )
                    self._nlp = spacy.blank("en")
            except ImportError:
                logger.warning("spaCy is not installed; operating in regex-only mode.")
                self._nlp = False
        return self._nlp

    def extract_skills(self, text: str | None) -> list[dict[str, str]]:
        """
        Extract skills from free-form text.

        Returns:
            List of unique dicts: [{"name": "Python", "normalized_name": "python", "category": "Languages"}]
        """
        if not text or not isinstance(text, str) or not text.strip():
            return []

        clean_text = text.strip()
        found_skills: dict[str, dict[str, str]] = {}

        # 1. Pattern matching pass
        for pattern, skill_name, category in self._regex_patterns:
            if pattern.search(clean_text):
                norm = skill_name.lower()
                if norm not in found_skills:
                    found_skills[norm] = {
                        "name": skill_name,
                        "normalized_name": norm,
                        "category": category,
                    }

        # 2. Preserve canonical order by category and name
        sorted_skills = sorted(
            found_skills.values(), key=lambda x: (x["category"], x["name"])
        )
        return sorted_skills

    def extract_role(self, title: str | None, description: str = "") -> dict[str, str]:
        """
        Extract and normalize job title to a canonical role and category.

        Returns:
            Dict: {"raw_title": str, "normalized_role": str, "category": str}
        """
        raw_title = (title or "").strip()
        if not raw_title:
            return {
                "raw_title": "",
                "normalized_role": "Unknown",
                "category": "General",
            }

        title_lower = raw_title.lower()

        # Check direct canonical mappings (longest/most specific patterns first)
        for key in sorted(ROLE_CANONICAL_MAP.keys(), key=len, reverse=True):
            if key in title_lower:
                canonical = ROLE_CANONICAL_MAP[key]
                category = self._categorize_role(canonical)
                return {
                    "raw_title": raw_title,
                    "normalized_role": canonical,
                    "category": category,
                }

        # Fallback check against words in description if title is very short/unclear
        desc_lower = (description or "")[:500].lower()
        for key in sorted(ROLE_CANONICAL_MAP.keys(), key=len, reverse=True):
            if re.search(rf"\b{re.escape(key)}\b", desc_lower):
                canonical = ROLE_CANONICAL_MAP[key]
                category = self._categorize_role(canonical)
                return {
                    "raw_title": raw_title,
                    "normalized_role": canonical,
                    "category": category,
                }

        return {
            "raw_title": raw_title,
            "normalized_role": raw_title,
            "category": "General",
        }

    def _categorize_role(self, canonical_role: str) -> str:
        """Group canonical roles into high-level categories."""
        if canonical_role in ("Data Scientist", "Machine Learning Engineer", "Data Engineer"):
            return "Data & AI"
        elif canonical_role in ("DevOps Engineer", "Security Engineer"):
            return "DevOps & Infrastructure"
        elif canonical_role == "QA Engineer":
            return "Quality Assurance"
        elif canonical_role == "Mobile Developer":
            return "Mobile Development"
        return "Software Engineering"

    def process_text(
        self, text: str | None, title: str = ""
    ) -> dict[str, Any]:
        """
        Unified extraction helper returning extracted skills and role categorization.
        """
        skills = self.extract_skills(text)
        skill_names = [s["name"] for s in skills]
        role_info = self.extract_role(title, description=text or "")

        return {
            "skills": skills,
            "skill_names": skill_names,
            "role": role_info,
        }


# Singleton instance holder
_NER_SERVICE_INSTANCE: NERService | None = None


def get_ner_service() -> NERService:
    """Factory function returning the singleton NERService instance."""
    global _NER_SERVICE_INSTANCE
    if _NER_SERVICE_INSTANCE is None:
        try:
            from django.conf import settings
            model_name = getattr(settings, "SPACY_MODEL", "en_core_web_sm")
        except Exception:
            model_name = "en_core_web_sm"
        _NER_SERVICE_INSTANCE = NERService(spacy_model_name=model_name)
    return _NER_SERVICE_INSTANCE
