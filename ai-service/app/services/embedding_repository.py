"""Database helpers for saving text embeddings."""

from typing import Any


def save_embeddings(entries: list[dict[str, Any]], connection) -> None:
    """Save multiple embeddings into the repository_embeddings table.

    Args:
        entries: List of embedding records.
        connection: An open PostgreSQL connection.
    """
    if not entries:
        return

    query = """
        INSERT INTO repository_embeddings (
            repository_file_id,
            chunk_index,
            chunk_text,
            embedding
        )
        VALUES (%s, %s, %s, %s)
    """

    values = [
        (
            entry["repository_file_id"],
            entry["chunk_index"],
            entry["chunk_text"],
            entry["embedding"],
        )
        for entry in entries
    ]

    with connection.cursor() as cursor:
        cursor.executemany(query, values)