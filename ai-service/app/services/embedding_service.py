"""Utilities for generating text embeddings."""

import os

import cohere


client = cohere.ClientV2(
    api_key=os.environ["COHERE_API_KEY"]
)


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """Generate embeddings for multiple texts.

    Args:
        texts: List of non-empty strings.

    Returns:
        List of embedding vectors.

    Raises:
        ValueError: If the input is invalid.
    """

    if not texts:
        raise ValueError("Texts must not be empty")

    for text in texts:
        if not isinstance(text, str) or not text.strip():
            raise ValueError("Each text must be a non-empty string")

    response = client.embed(
        model="embed-v4.0",
        input_type="search_document",
        embedding_types=["float"],
        texts=texts,
    )

    return response.embeddings.float


def generate_embedding(
    text: str,
) -> list[float]:
    """Generate an embedding for a single text."""

    return generate_embeddings([text])[0]