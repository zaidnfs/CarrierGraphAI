"""
Unit tests for the NER and Skill/Role extraction service (TASK-013, TASK-015).
Covers test plan cases U-12, U-13, U-14, and U-15.
"""
import pytest
from services.ner_service import NERService, get_ner_service


@pytest.fixture
def ner():
    return get_ner_service()


class TestNERServiceSkills:
    """Tests for skill extraction from job text (U-12, U-14, U-15)."""

    def test_u12_extract_skills_from_description(self, ner):
        """
        U-12: Extract skills from a job description containing 'Python, Django, PostgreSQL'.
        Expected: Returns list containing 'Python', 'Django', 'PostgreSQL'.
        """
        text = "We are seeking a Backend Engineer with expertise in Python, Django, and PostgreSQL."
        skills = ner.extract_skills(text)
        skill_names = [s["name"] for s in skills]

        assert "Python" in skill_names
        assert "Django" in skill_names
        assert "PostgreSQL" in skill_names

    def test_u14_handle_text_with_no_identifiable_skills(self, ner):
        """
        U-14: Handle job description with no identifiable skills.
        Expected: Returns empty list, no error.
        """
        text = "Looking for someone to manage day-to-day office supplies and coordinate vendor meetings."
        skills = ner.extract_skills(text)
        assert skills == []

    def test_u15_handle_empty_string_input(self, ner):
        """
        U-15: Handle empty string input, whitespace, or None.
        Expected: Returns empty list, no crash.
        """
        assert ner.extract_skills("") == []
        assert ner.extract_skills("   ") == []
        assert ner.extract_skills(None) == []

    def test_tricky_boundary_symbols(self, ner):
        """Test symbols and short tokens like C++, C#, .NET, Node.js, and Go."""
        text = "Requirements include C++, C#, .NET Core, Node.js, and Go programming."
        skills = ner.extract_skills(text)
        names = {s["name"] for s in skills}

        assert "C++" in names
        assert "C#" in names
        assert any(".NET" in n for n in names)
        assert "Node.js" in names
        assert "Go" in names

    def test_skill_categories(self, ner):
        """Verify that extracted skills are mapped to proper technical categories."""
        text = "Experience with Python, React, Redis, AWS, Docker, and Machine Learning."
        skills = ner.extract_skills(text)
        cat_map = {s["name"]: s["category"] for s in skills}

        assert cat_map["Python"] == "Languages"
        assert cat_map["React"] == "Frameworks"
        assert cat_map["Redis"] == "Databases"
        assert cat_map["AWS"] == "Cloud & DevOps"
        assert cat_map["Docker"] == "Cloud & DevOps"
        assert cat_map["Machine Learning"] == "AI & Data Science"

    def test_case_insensitivity(self, ner):
        """Test skill matching is case-insensitive for standard technical terms."""
        text = "Proficient in python, DJANGO, and Docker."
        skills = ner.extract_skills(text)
        names = {s["name"] for s in skills}

        assert "Python" in names
        assert "Django" in names
        assert "Docker" in names


class TestNERServiceRoles:
    """Tests for role extraction and normalization (U-13)."""

    def test_u13_extract_role_senior_backend_developer(self, ner):
        """
        U-13: Extract role from a job title 'Senior Backend Developer'.
        Expected: Returns normalized role 'Backend Developer'.
        """
        role_info = ner.extract_role("Senior Backend Developer")
        assert role_info["normalized_role"] == "Backend Developer"
        assert role_info["category"] == "Software Engineering"

    def test_extract_various_roles(self, ner):
        """Test normalization across different job titles."""
        test_cases = [
            ("Lead Frontend Engineer", "Frontend Developer"),
            ("Full Stack Software Engineer", "Full Stack Developer"),
            ("Principal Data Scientist", "Data Scientist"),
            ("AI / Machine Learning Engineer", "Machine Learning Engineer"),
            ("Cloud DevOps Engineer", "DevOps Engineer"),
            ("iOS Mobile App Developer", "Mobile Developer"),
        ]
        for title, expected_role in test_cases:
            res = ner.extract_role(title)
            assert res["normalized_role"] == expected_role, f"Failed for title: {title}"

    def test_extract_role_empty_input(self, ner):
        """Test extracting role with empty or None input."""
        res_empty = ner.extract_role("")
        assert res_empty["normalized_role"] == "Unknown"
        assert res_empty["category"] == "General"

        res_none = ner.extract_role(None)
        assert res_none["normalized_role"] == "Unknown"


class TestNERServiceProcessText:
    """Tests for unified process_text method."""

    def test_process_text_combined(self, ner):
        """Test combined skills and role extraction."""
        title = "Staff Backend Engineer"
        desc = "Seeking a developer experienced with Python, FastAPI, PostgreSQL, and Kubernetes."

        result = ner.process_text(desc, title=title)
        assert result["role"]["normalized_role"] == "Backend Developer"
        assert "Python" in result["skill_names"]
        assert "FastAPI" in result["skill_names"]
        assert "PostgreSQL" in result["skill_names"]
        assert "Kubernetes" in result["skill_names"]
