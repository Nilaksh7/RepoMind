"""Pydantic models for repository question requests and responses."""

from pydantic import BaseModel


class QuestionRequest(BaseModel):
	"""Request body for asking a question about a repository."""

	question: str


class QuestionResponse(BaseModel):
	"""Response body containing the generated answer."""

	answer: str
