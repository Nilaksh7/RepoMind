"""Repository processing pipeline for generating embeddings."""

from app.config.database import pool
from app.services.embedding_repository import save_embeddings
from app.services.embedding_service import generate_embeddings
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
    """Process a repository and generate embeddings for every text chunk."""

    update_ai_index_status(
        repository_id,
        "indexing",
    )

    try:
        files = get_repository_files(repository_id)

        files_processed = 0
        chunks_processed = 0
        embedding_records = []

        pending_chunks = []

        for file_entry in files:
            content = file_entry.get("content")

            if not content or not content.strip():
                continue

            files_processed += 1

            chunks = chunk_text(content)

            for chunk_index, chunk in enumerate(chunks):
                pending_chunks.append(
                    {
                        "repository_file_id": file_entry["id"],
                        "path": file_entry["path"],
                        "chunk_index": chunk_index,
                        "chunk_text": chunk,
                    }
                )

        BATCH_SIZE = 50

        for start in range(0, len(pending_chunks), BATCH_SIZE):
            batch = pending_chunks[start:start + BATCH_SIZE]

            texts = [
                item["chunk_text"]
                for item in batch
            ]

            embeddings = generate_embeddings(texts)

            for item, embedding in zip(batch, embeddings):
                embedding_records.append(
                    {
                        "repository_file_id": item["repository_file_id"],
                        "chunk_index": item["chunk_index"],
                        "chunk_text": item["chunk_text"],
                        "embedding": embedding,
                    }
                )

                print(f"File: {item['path']}")
                print(f"Chunk: {item['chunk_index']}")
                print(f"Chunk size: {len(item['chunk_text'])}")
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