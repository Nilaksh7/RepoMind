"""Service for generating AI explanations for repository files."""

from app.services.llm_service import generate_answer


def explain_file(
    file_path: str,
    extension: str,
    content: str,
) -> str:
    """Generate an AI explanation for a repository file."""

    prompt = f"""
You are a senior software engineer reviewing a source code file.

Your task is to explain the given file in a clear, beginner-friendly, and well-structured way.

File Path:
{file_path}

File Type:
{extension}

Code:
~~~{extension.lstrip(".")}
{content}
~~~

Provide the explanation in Markdown using the following sections:

# Purpose
Explain what this file is responsible for.

# How it Works
Describe the overall workflow and logic of the file.

# Key Functions / Classes
List the important functions or classes and explain what each one does.

# Important Variables
Mention any important variables, constants, or state used in the file.

# Dependencies
Mention important libraries, modules, or project files used by this file.

# Summary
Give a short overall summary of the file.

Keep the explanation concise, accurate, and easy to understand.
Return only Markdown without any additional text.
"""

    return generate_answer(prompt)