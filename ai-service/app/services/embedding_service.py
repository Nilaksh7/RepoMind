"""Utilities for generating text embeddings using Gemini."""

import os
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

MODEL = "gemini-embedding-001"
MAX_RETRIES = 3


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for multiple texts.

    Args:
        texts: List of input texts.

    Returns:
        List of embedding vectors in the same order.

    Raises:
        ValueError: If the input list is empty.
    """

    if not texts:
        raise ValueError("texts cannot be empty")

    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.embed_content(
                model=MODEL,
                contents=texts,
            )

            return [
                embedding.values
                for embedding in response.embeddings
            ]

        except Exception as error:
            message = str(error)

            should_retry = (
                "429" in message
                or "503" in message
                or "RESOURCE_EXHAUSTED" in message
                or "UNAVAILABLE" in message
            )

            if not should_retry or attempt == MAX_RETRIES - 1:
                raise

            time.sleep(2 ** attempt)
            

def generate_embedding(text: str) -> list[float]:
    """Generate an embedding for a single text."""

    if not isinstance(text, str) or not text.strip():
        raise ValueError("Text must be a non-empty string")

    return generate_embeddings([text])[0]