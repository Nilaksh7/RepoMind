"""Repository processing pipeline for generating embeddings."""

from app.config.database import pool
from app.services.embedding_repository import save_embeddings
from app.services.embedding_service import generate_embedding
from app.services.repository_service import get_repository_files
from app.utils.text_chunker import chunk_text


def update_ai_index_status(
    repository_id: str,
    status: str,
) -> None:
    """Update the AI indexing status for a repository."""

    with pool.connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE repositories
                SET ai_index_status = %s
                WHERE id = %s;
                """,
                (
                    status,
                    repository_id,
                ),
            )

        connection.commit()


def process_repository(repository_id: str) -> dict:
    """Process a repository and generate embeddings for every text chunk.

    Args:
        repository_id: Repository UUID.

    Returns:
        Dictionary containing processing statistics.
    """

    update_ai_index_status(
        repository_id,
        "indexing",
    )

    try:
        files = get_repository_files(repository_id)

        files_processed = 0
        chunks_processed = 0
        embedding_records = []

        for file_entry in files:
            content = file_entry.get("content")

            if not content or not content.strip():
                continue

            files_processed += 1

            chunks = chunk_text(content)

            for chunk_index, chunk in enumerate(chunks):
                embedding = generate_embedding(chunk)

                embedding_records.append(
                    {
                        "repository_file_id": file_entry["id"],
                        "chunk_index": chunk_index,
                        "chunk_text": chunk,
                        "embedding": embedding,
                    }
                )

                print(f"File: {file_entry['path']}")
                print(f"Chunk: {chunk_index}")
                print(f"Chunk size: {len(chunk)}")
                print(f"Embedding dimension: {len(embedding)}")
                print("-" * 50)

                chunks_processed += 1

        if embedding_records:
            with pool.connection() as connection:
                try:
                    save_embeddings(
                        embedding_records,
                        connection,
                    )
                    connection.commit()
                except Exception:
                    connection.rollback()
                    raise

        update_ai_index_status(
            repository_id,
            "completed",
        )

        return {
            "files_processed": files_processed,
            "chunks_processed": chunks_processed,
            "embedding_records": len(embedding_records),
        }

    except Exception:
        update_ai_index_status(
            repository_id,
            "failed",
        )
        raise