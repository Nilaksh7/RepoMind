"""Semantic repository search service."""

from pathlib import PurePosixPath

from psycopg.rows import dict_row

from app.config.database import pool
from app.services.embedding_service import generate_embedding


CODE_EXTENSIONS = {
    "py",
    "js",
    "jsx",
    "ts",
    "tsx",
    "java",
    "c",
    "cpp",
    "go",
    "rs",
}

IGNORE_EXTENSIONS = {
    "md",
    "rst",
    "txt",
    "json",
    "lock",
    "yml",
    "yaml",
}


def search_repository(
    repository_id: str,
    query: str,
    limit: int = 30,
) -> list[dict]:
    """Search for the most relevant chunks inside a repository."""

    query_embedding = generate_embedding(query)

    with pool.connection() as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                SELECT
                    rf.id AS file_id,
                    rf.path AS file_path,
                    re.chunk_index,
                    re.chunk_text,
                    1 - (re.embedding <=> %s::vector) AS similarity
                FROM repository_embeddings re
                JOIN repository_files rf
                    ON rf.id = re.repository_file_id
                WHERE rf.repository_id = %s
                ORDER BY re.embedding <=> %s::vector
                LIMIT %s
                """,
                (
                    query_embedding,
                    repository_id,
                    query_embedding,
                    limit,
                ),
            )

            results = cursor.fetchall()

    for result in results:
        result["file_id"] = str(result["file_id"])

        path = PurePosixPath(result["file_path"])

        result["file_name"] = path.name
        result["extension"] = path.suffix.lstrip(".")

        similarity = max(
            0.0,
            min(
                1.0,
                result["similarity"],
            ),
        )

        result["similarity"] = round(similarity * 100, 2)

    return results


def format_search_results(
    results: list[dict],
    query: str,
    limit: int = 10,
) -> list[dict]:
    """Prepare semantic search results for the frontend."""

    query = query.lower().strip()

    unique_results = []
    seen_files = set()

    for result in results:
        file_id = result["file_id"]

        if file_id in seen_files:
            continue

        # Skip documentation/config files
        if result["extension"] in IGNORE_EXTENSIONS:
            continue

        seen_files.add(file_id)

        similarity = result["similarity"]

        # Prefer source code
        if result["extension"] in CODE_EXTENSIONS:
            similarity += 5

        # Prefer backend implementation files
        if result["file_path"].startswith("backend/"):
            similarity += 8
        elif result["file_path"].startswith("frontend/"):
            similarity += 2

        # Boost filename matches
        if query in result["file_name"].lower():
            similarity += 20

        # Boost path matches
        if query in result["file_path"].lower():
            similarity += 10

        # Boost exact text matches
        if query in result["chunk_text"].lower():
            similarity += 10

        similarity = max(0, min(similarity, 100))

        text = result["chunk_text"].strip()

        if len(text) > 300:
            text = text[:300] + "..."

        unique_results.append(
            {
                **result,
                "similarity": round(similarity, 2),
                "chunk_text": text,
            }
        )

    unique_results.sort(
        key=lambda item: item["similarity"],
        reverse=True,
    )

    return unique_results[:limit]