"""API routes for repository question answering."""

from fastapi import APIRouter, Depends, HTTPException
from app.models.chat import QuestionRequest, QuestionResponse
from app.models.file_explanation import (
    FileExplanationRequest,
    FileExplanationResponse,
)
from app.services.embedding_pipeline import process_repository
from app.services.file_explanation_service import explain_file
from app.services.rag_service import (
    answer_repository_question,
    summarize_repository,
)

from app.models.dependency_graph import DependencyGraphResponse
from app.services.dependency_service import build_dependency_graph

from app.security import verify_internal_api_key

from fastapi import Query

from app.models.search import (
    SearchResponse,
    SearchResult,
)

from app.services.search_service import (
    search_repository,
    format_search_results,
)

router = APIRouter(
    dependencies=[
        Depends(verify_internal_api_key),
    ],
)


@router.post(
    "/repositories/{repository_id}/ask",
    response_model=QuestionResponse,
)
def ask_repository_question(
    repository_id: str,
    request: QuestionRequest,
) -> QuestionResponse:
    """Answer a question about a repository using the RAG service."""

    try:
        answer = answer_repository_question(
            repository_id,
            request.question,
        )

        return QuestionResponse(
            answer=answer,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@router.post(
    "/repositories/{repository_id}/summary",
)
def summarize_repository_endpoint(
    repository_id: str,
):
    """Generate an AI summary of a repository."""

    try:
        summary = summarize_repository(repository_id)

        return {
            "summary": summary,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@router.post(
    "/repositories/{repository_id}/index",
)
def index_repository(
    repository_id: str,
):
    """Generate embeddings for a repository."""

    try:
        result = process_repository(repository_id)

        return {
            "success": True,
            **result,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@router.post(
    "/repositories/{repository_id}/files/explain",
    response_model=FileExplanationResponse,
)
def explain_repository_file(
    repository_id: str,
    request: FileExplanationRequest,
) -> FileExplanationResponse:
    """Generate an AI explanation for a repository file."""

    try:
        explanation = explain_file(
            file_path=request.path,
            extension=request.extension,
            content=request.content,
        )

        return FileExplanationResponse(
            explanation=explanation,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error

@router.get(
    "/repositories/{repository_id}/dependency-graph",
    response_model=DependencyGraphResponse,
)
def dependency_graph(
    repository_id: str,
) -> DependencyGraphResponse:
    """Generate dependency graph for a repository."""

    try:
        return build_dependency_graph(repository_id)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error
    

@router.get(
    "/repositories/{repository_id}/search",
    response_model=SearchResponse,
)
def semantic_search(
    repository_id: str,
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
) -> SearchResponse:
    """Perform semantic search over a repository."""

    try:
        results = search_repository(
            repository_id=repository_id,
            query=query,
            limit=30,
        )

        formatted_results = format_search_results(
            results,
            query=query,
            limit=limit,
        )

        return SearchResponse(
            results=formatted_results,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error