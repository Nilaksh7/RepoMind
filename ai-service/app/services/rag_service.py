"""RAG service for answering questions about a repository."""

from app.services.llm_service import generate_answer
from app.services.search_service import search_repository


def build_prompt(
    question: str,
    results: list[dict[str, object]],
) -> str:
    """Build a prompt for repository question answering."""

    parts = [
    "You are RepoMind, an expert software engineer that answers questions about GitHub repositories.",
    "",
    "You must answer ONLY using the provided repository context.",
    "Do not use outside knowledge.",
    "If the answer is not present in the repository context, do not guess.",
    'Instead respond with: "I couldn\'t find enough information in the repository."',
    "",
    "When answering:",
    "- Always mention the relevant file path(s) whenever possible.",
    "- If multiple files contribute to the answer, explain the role of each.",
    "- Use Markdown bullet points for relevant files.",
    "- Mention function or class names if they are available.",
    "- Keep the answer concise and structured.",
    "",
    "Repository Context:",
    "",
]

    for index, result in enumerate(results):
        parts.extend([
            f"### File: {result['file_path']}",
            f"Chunk: {result['chunk_index']}",
            "",
            result["chunk_text"],
        ])

        if index < len(results) - 1:
            parts.extend(
                [
                    "",
                    "----------------------------------------",
                    "",
                ]
            )

    parts.extend(
        [
            "",
            f"User Question: {question}",
            "",
            "Answer:",
        ]
    )

    return "\n".join(parts)


def build_summary_prompt(
    results: list[dict[str, object]],
) -> str:
    """Build a prompt for generating a repository summary."""

    parts = [
        "You are RepoMind, an expert software engineer.",
        "",
        "Using ONLY the repository context below, generate a concise repository summary.",
        "",
        "Your response must contain these sections:",
        "",
        "# Purpose",
        "# Tech Stack",
        "# Architecture",
        "# Main Modules",
        "# Entry Point",
        "# Interesting Notes",
        "",
        "If a section cannot be determined, write 'Not identified from the repository.'",
        "",
        "Repository Context:",
        "",
    ]

    for index, result in enumerate(results):
        parts.extend(
            [
                f"File: {result['file_path']}",
                "",
                str(result["chunk_text"]),
            ]
        )

        if index < len(results) - 1:
            parts.extend(
                [
                    "",
                    "----------------------------------------",
                    "",
                ]
            )

    parts.extend(
        [
            "",
            "Repository Summary:",
        ]
    )

    return "\n".join(parts)


def answer_repository_question(
    repository_id: str,
    question: str,
) -> str:
    """Answer a repository question using Retrieval-Augmented Generation."""

    results = search_repository(
        repository_id=repository_id,
        query=question,
    )

    if not results:
        return "No relevant code was found in the repository."

    prompt = build_prompt(
        question=question,
        results=results,
    )

    return generate_answer(prompt)


def summarize_repository(
    repository_id: str,
) -> str:
    """Generate an AI summary of a repository."""

    results = search_repository(
        repository_id=repository_id,
        query="repository overview architecture tech stack main entry point",
        limit=20,
    )

    if not results:
        return "No repository information was found."

    prompt = build_summary_prompt(results)

    return generate_answer(prompt)