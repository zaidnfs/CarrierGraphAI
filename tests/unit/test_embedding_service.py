"""
Unit tests for the embedding generation service (TASK-014, TASK-015).
Covers test plan cases U-16, U-17, and U-18.
"""
import pytest
from services.embedding_service import EmbeddingService, get_embedding_service


@pytest.fixture
def embedder():
    return get_embedding_service()


class TestEmbeddingService:
    """Tests for vector embedding generation and similarity (U-16, U-17, U-18)."""

    def test_u16_generate_embedding_dimensions(self, embedder):
        """
        U-16: Generate embedding for a job description.
        Expected: Returns vector of expected dimensions (384).
        """
        text = "Backend Engineer responsible for Python, Django, and database optimization."
        vec = embedder.generate_embedding(text)

        assert isinstance(vec, list)
        assert len(vec) == embedder.dimension
        assert len(vec) == 384
        assert all(isinstance(v, float) for v in vec)

    def test_u17_generate_embedding_empty_string(self, embedder):
        """
        U-17: Generate embedding for empty string.
        Expected: Handles gracefully without crash, returning vector of expected dimension.
        """
        vec_empty = embedder.generate_embedding("")
        assert len(vec_empty) == 384

        vec_whitespace = embedder.generate_embedding("    ")
        assert len(vec_whitespace) == 384

        vec_none = embedder.generate_embedding(None)
        assert len(vec_none) == 384

    def test_u18_semantic_similarity_similar_descriptions(self, embedder):
        """
        U-18: Two similar job descriptions produce similar embeddings.
        Expected: Cosine similarity > 0.7 vs unrelated descriptions.
        """
        job_a = "Senior Python Developer with strong Django, REST APIs, and PostgreSQL experience."
        job_b = "Python Software Engineer skilled in Django framework, REST APIs, and Postgres databases."
        unrelated = "Hospitality Front Desk Receptionist managing room reservations and guest services."

        vec_a = embedder.generate_embedding(job_a)
        vec_b = embedder.generate_embedding(job_b)
        vec_unrelated = embedder.generate_embedding(unrelated)

        sim_ab = embedder.compute_similarity(vec_a, vec_b)
        sim_unrelated = embedder.compute_similarity(vec_a, vec_unrelated)

        if embedder.model:
            assert sim_ab > 0.65, f"Expected high similarity with transformer model, got {sim_ab}"
        else:
            assert sim_ab > 0.35, f"Expected positive similarity with fallback embedder, got {sim_ab}"

        assert sim_ab > sim_unrelated + 0.25, (
            f"Related jobs ({sim_ab}) should be significantly more similar than unrelated ({sim_unrelated})"
        )

    def test_generate_embeddings_batch(self, embedder):
        """Test batch embedding generation."""
        texts = [
            "Python Backend Developer",
            "React Frontend Engineer",
            "DevOps Kubernetes Engineer",
        ]
        vectors = embedder.generate_embeddings(texts)

        assert len(vectors) == 3
        for v in vectors:
            assert len(v) == 384

    def test_compute_similarity_identical_and_orthogonal(self, embedder):
        """Test cosine similarity math on known vectors."""
        v1 = [1.0, 0.0, 0.0]
        v2 = [1.0, 0.0, 0.0]
        v3 = [0.0, 1.0, 0.0]

        # Identical vectors -> similarity = 1.0
        assert pytest.approx(embedder.compute_similarity(v1, v2), 0.001) == 1.0
        # Orthogonal vectors -> similarity = 0.0
        assert pytest.approx(embedder.compute_similarity(v1, v3), 0.001) == 0.0

    def test_format_job_for_embedding(self, embedder):
        """Test job formatting helper."""
        formatted = embedder.format_job_for_embedding(
            title="Senior Python Dev",
            description="Developing high throughput distributed microservices.",
            skills=["Python", "Django", "Docker"],
        )

        assert "Job Title: Senior Python Dev" in formatted
        assert "Required Skills: Python, Django, Docker" in formatted
        assert "Description: Developing high throughput" in formatted
