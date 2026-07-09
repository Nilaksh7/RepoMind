"""Pydantic models for semantic search."""

from pydantic import BaseModel


class SearchResult(BaseModel):
    """Single semantic search result."""

    file_id: str
    file_path: str
    file_name: str
    extension: str
    chunk_index: int
    chunk_text: str
    similarity: float


class SearchResponse(BaseModel):
    """Semantic search response."""

    results: list[SearchResult]