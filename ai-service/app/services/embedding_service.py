"""Utilities for generating text embeddings."""

from sentence_transformers import SentenceTransformer


model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
	"""Generate a single embedding vector for the given text.

	Args:
		text: The input text to embed.

	Returns:
		A list of floats representing the embedding vector.

	Raises:
		ValueError: If text is empty or only whitespace.
	"""
	if not isinstance(text, str) or not text.strip():
		raise ValueError("Text must be a non-empty string")

	embedding = model.encode(text)
	return embedding.tolist()
