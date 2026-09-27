"""
Embedding generation service for SkillBridge AI.
Generates dense vector embeddings using sentence-transformers (all-MiniLM-L6-v2, 384 dims)
for semantic job search and resume-to-job matching.
Includes lazy loading and test-resilient deterministic fallback.
"""
import hashlib
import logging
import math
from typing import Any

logger = logging.getLogger(__name__)

DEFAULT_MODEL_NAME = "all-MiniLM-L6-v2"
DEFAULT_EMBEDDING_DIM = 384


STOP_WORDS = {
    "and", "with", "in", "for", "to", "the", "a", "an", "of", "or",
    "at", "by", "from", "is", "are", "on", "as", "be", "our", "we", "who", "all",
}


class EmbeddingService:
    """
    Service responsible for converting textual content into dense vector representations.
    Supports batch generation, cosine similarity calculation, and text formatting.
    """

    def __init__(self, model_name: str = DEFAULT_MODEL_NAME):
        self.model_name = model_name
        self._model: Any = None
        self._dimension = DEFAULT_EMBEDDING_DIM

    @property
    def dimension(self) -> int:
        """Returns the embedding vector dimensionality (384 for all-MiniLM-L6-v2)."""
        return self._dimension

    @property
    def model(self) -> Any:
        """
        Lazy-loads the SentenceTransformer model on first access.
        """
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer

                logger.info(f"Loading SentenceTransformer model: {self.model_name}")
                self._model = SentenceTransformer(self.model_name)
                # Query model dimension
                if hasattr(self._model, "get_sentence_embedding_dimension"):
                    self._dimension = self._model.get_sentence_embedding_dimension()
            except Exception as exc:
                logger.warning(
                    f"SentenceTransformer could not be loaded ({exc}). Using deterministic fallback."
                )
                self._model = False
        return self._model

    def generate_embedding(self, text: str | None) -> list[float]:
        """
        Generate a 384-dimensional dense vector for the given text.

        Args:
            text: Input string.

        Returns:
            List of floats representing the normalized embedding vector.
        """
        if not text or not isinstance(text, str) or not text.strip():
            # Return zero vector for empty input
            return [0.0] * self.dimension

        clean_text = " ".join(text.strip().split())

        # If real sentence-transformers model is loaded
        if self.model:
            try:
                embedding = self.model.encode(
                    clean_text,
                    convert_to_numpy=True,
                    normalize_embeddings=True,
                )
                return embedding.tolist()
            except Exception as exc:
                logger.error(f"Error generating embedding via SentenceTransformer: {exc}")

        # Fallback: Deterministic normalized vector derived from token hashing
        return self._fallback_embedding(clean_text)

    def generate_embeddings(
        self, texts: list[str], batch_size: int = 32
    ) -> list[list[float]]:
        """
        Generate embeddings for a batch of strings.

        Args:
            texts: List of text inputs.
            batch_size: Batch size for model inference.

        Returns:
            List of embedding vectors.
        """
        if not texts:
            return []

        if self.model:
            try:
                cleaned = [" ".join(t.strip().split()) if t else "" for t in texts]
                embeddings = self.model.encode(
                    cleaned,
                    batch_size=batch_size,
                    convert_to_numpy=True,
                    normalize_embeddings=True,
                    show_progress_bar=False,
                )
                return embeddings.tolist()
            except Exception as exc:
                logger.error(f"Error generating batch embeddings: {exc}")

        return [self.generate_embedding(t) for t in texts]

    @staticmethod
    def compute_similarity(vec_a: list[float], vec_b: list[float]) -> float:
        """
        Compute cosine similarity between two vectors.
        Returns value in range [-1.0, 1.0], where 1.0 is identical.
        """
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0

        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0

        similarity = dot / (norm_a * norm_b)
        return float(max(-1.0, min(1.0, similarity)))

    @staticmethod
    def format_job_for_embedding(
        title: str, description: str, skills: list[str] | None = None
    ) -> str:
        """
        Construct a consistent, information-dense text representation of a job posting
        for embedding generation.
        """
        parts = [f"Job Title: {title.strip()}"]
        if skills:
            clean_skills = [s.strip() for s in skills if s and s.strip()]
            if clean_skills:
                parts.append(f"Required Skills: {', '.join(clean_skills)}")
        if description:
            clean_desc = " ".join(description.strip().split()[:300])  # first 300 words
            parts.append(f"Description: {clean_desc}")

        return " | ".join(parts)

    def _fallback_embedding(self, text: str) -> list[float]:
        """
        Generates a deterministic 384-dimensional unit vector from text tokens.
        Includes subword 3-grams and stop-word filtering to provide realistic
        morphological and semantic overlap properties in development/test mode.
        """
        raw_words = re_tokenize(text.lower())
        words = [w for w in raw_words if w not in STOP_WORDS]
        vec = [0.0] * self.dimension

        if not words:
            return vec

        # Tokens + 3-grams for morphological similarity (e.g. develop/developer, postgres/postgresql)
        features: list[str] = list(words)
        for w in words:
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    features.append(w[i : i + 3])

        for feat in features:
            h = hashlib.sha256(feat.encode("utf-8")).digest()
            idx = int.from_bytes(h[:2], "big") % self.dimension
            val = ((h[2] / 255.0) * 2.0) - 1.0  # value in [-1.0, 1.0]
            vec[idx] += val

        # Normalize to unit length
        norm = math.sqrt(sum(v * v for v in vec))
        if norm > 0:
            vec = [v / norm for v in vec]

        return vec


def re_tokenize(text: str) -> list[str]:
    """Simple alphanumeric tokenization helper."""
    import re
    return re.findall(r"\b\w+\b", text)


# Singleton instance
_EMBEDDING_SERVICE_INSTANCE: EmbeddingService | None = None


def get_embedding_service() -> EmbeddingService:
    """Factory function returning the singleton EmbeddingService instance."""
    global _EMBEDDING_SERVICE_INSTANCE
    if _EMBEDDING_SERVICE_INSTANCE is None:
        try:
            from django.conf import settings
            model_name = getattr(settings, "EMBEDDING_MODEL_NAME", DEFAULT_MODEL_NAME)
        except Exception:
            model_name = DEFAULT_MODEL_NAME
        _EMBEDDING_SERVICE_INSTANCE = EmbeddingService(model_name=model_name)
    return _EMBEDDING_SERVICE_INSTANCE
