from typing import List


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Split text into overlapping chunks.

    Args:
        text: The input text to split.
        chunk_size: The maximum size of each chunk.
        overlap: The number of characters shared between consecutive chunks.

    Returns:
        A list of text chunks.

    Raises:
        ValueError: If chunk_size is not greater than overlap or if the
            numeric arguments are not valid.
    """

    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0")

    if overlap < 0:
        raise ValueError("overlap must be greater than or equal to 0")

    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than overlap")

    if not text or text.strip() == "":
        return []

    chunks = []
    step = chunk_size - overlap

    for start in range(0, len(text), step):
        chunk = text[start:start + chunk_size].strip()

        if chunk:
            chunks.append(chunk)

        if start + chunk_size >= len(text):
            break

    return chunks
