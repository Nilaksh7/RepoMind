"""Repository data access helpers."""

from typing import Any

from psycopg.rows import dict_row

from app.config.database import pool


def get_repository_files(repository_id: str) -> list[dict[str, Any]]:
    """Fetch all files and their contents for a repository."""

    with pool.connection() as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                SELECT
                    rf.id,
                    rf.path,
                    rf.extension,
                    rfc.content,
                    rfc.size_bytes
                FROM repository_files rf
                JOIN repository_file_contents rfc
                    ON rfc.repository_file_id = rf.id
                WHERE rf.repository_id = %s
                ORDER BY rf.path;
                """,
                (repository_id,),
            )

            return cursor.fetchall()