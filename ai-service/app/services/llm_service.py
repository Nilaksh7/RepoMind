"""Service for interacting with the Gemini API."""

import os
import time

from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def generate_answer(prompt: str) -> str:
    """Generate an answer using Gemini with automatic retries."""

    max_attempts = 3
    backoff_seconds = 2

    last_error = None

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=prompt,
            )

            return response.text.strip()

        except Exception as error:
            last_error = error

            error_message = str(error)

            should_retry = (
                "503" in error_message
                or "UNAVAILABLE" in error_message
                or "429" in error_message
                or "RESOURCE_EXHAUSTED" in error_message
            )

            if not should_retry or attempt == max_attempts - 1:
                raise

            wait_time = backoff_seconds * (2 ** attempt)

            print(
                f"Gemini temporarily unavailable. "
                f"Retrying in {wait_time} seconds..."
            )

            time.sleep(wait_time)

    raise last_error