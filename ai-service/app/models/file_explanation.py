from pydantic import BaseModel


class FileExplanationRequest(BaseModel):
    path: str
    extension: str | None = None
    content: str


class FileExplanationResponse(BaseModel):
    explanation: str