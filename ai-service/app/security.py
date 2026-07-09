import os

from fastapi import Header, HTTPException


AI_SERVICE_API_KEY = os.getenv("AI_SERVICE_API_KEY")


def verify_internal_api_key(
    x_api_key: str | None = Header(default=None),
):
    """
    Allow requests only from the backend.
    """

    if AI_SERVICE_API_KEY is None:
        raise HTTPException(
            status_code=500,
            detail="AI service API key is not configured.",
        )

    if x_api_key != AI_SERVICE_API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
        )