"""Generate dependency graphs for supported programming languages."""

from pathlib import PurePosixPath
import posixpath

from app.models.dependency_graph import (
    DependencyGraphResponse,
    GraphEdge,
    GraphNode,
)
from app.services.parsers import PARSERS
from app.services.repository_service import get_repository_files


def _normalize_path(path: str) -> str:
    """Normalize file paths to POSIX style."""
    return path.replace("\\", "/")


def _build_file_index(files: list[dict]) -> dict[str, str]:
    """
    Build a lookup table.

    Example:
        app/services/rag_service.py
            ->
        app/services/rag_service
    """

    index = {}

    for file in files:
        path = _normalize_path(file["path"])

        suffix = PurePosixPath(path).suffix

        if not suffix:
            continue

        key = path[: -len(suffix)]

        index[key] = path

    return index


def _resolve_python_import(
    imported: str,
    file_index: dict[str, str],
) -> str | None:
    """Resolve Python module imports."""

    candidate = imported.replace(".", "/")

    return file_index.get(candidate)


JS_TS_EXTENSIONS = (
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",
    ".mts",
    ".cts",
)


def _lookup_candidate(
    candidate: str,
    file_index: dict[str, str],
) -> str | None:
    """Return repository file if the candidate exists."""

    candidate = candidate.replace("\\", "/")

    suffix = PurePosixPath(candidate).suffix

    if suffix:
        key = candidate[:-len(suffix)]
    else:
        key = candidate

    return file_index.get(key)


def _generate_candidates(path: str) -> list[str]:
    """Generate all possible JS/TS file candidates."""

    candidates = [path]

    for extension in JS_TS_EXTENSIONS:
        candidates.append(path + extension)

    for extension in JS_TS_EXTENSIONS:
        candidates.append(f"{path}/index{extension}")

    return candidates


def _resolve_relative_import(
    current_path: str,
    imported: str,
    file_index: dict[str, str],
) -> str | None:
    """Resolve JavaScript/TypeScript relative imports."""

    current_directory = PurePosixPath(current_path).parent

    resolved = posixpath.normpath(
        current_directory.joinpath(imported).as_posix()
    )

    for candidate in _generate_candidates(resolved):

        result = _lookup_candidate(
            candidate,
            file_index,
        )

        if result is not None:
            return result

    return None


def build_dependency_graph(
    repository_id: str,
) -> DependencyGraphResponse:
    """Build dependency graph for all supported source files."""

    files = get_repository_files(repository_id)

    file_index = _build_file_index(files)

    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []

    for file in files:
        path = _normalize_path(file["path"])

        extension = file["extension"]

        parser = PARSERS.get(extension)

        if parser is None:
            continue

        parts = PurePosixPath(path).parts

        if len(parts) >= 2:
            label = "/".join(parts[-2:])
        else:
            label = parts[-1]

        nodes.append(
            GraphNode(
                id=path,
                label=label,
                type=extension.lstrip("."),
            )
        )

        imports = parser.parse_imports(
            file["content"],
            path,
        )

        for imported in imports:
            target = None

            if extension == ".py":
                target = _resolve_python_import(
                    imported,
                    file_index,
                )

            elif extension in {
                ".js",
                ".jsx",
                ".ts",
                ".tsx",
            }:
                if imported.startswith("."):
                    target = _resolve_relative_import(
                        path,
                        imported,
                        file_index,
                    )

            if target is not None:
                edges.append(
                    GraphEdge(
                        source=path,
                        target=target,
                    )
                )

    # Remove duplicate edges
    unique_edges: list[GraphEdge] = []
    seen_edges: set[tuple[str, str]] = set()

    for edge in edges:
        key = (edge.source, edge.target)

        if key in seen_edges:
            continue

        seen_edges.add(key)
        unique_edges.append(edge)

    edges = unique_edges

    # Remove isolated nodes
    connected_nodes: set[str] = set()

    for edge in edges:
        connected_nodes.add(edge.source)
        connected_nodes.add(edge.target)

    nodes = [
        node
        for node in nodes
        if node.id in connected_nodes
    ]

    return DependencyGraphResponse(
        nodes=nodes,
        edges=edges,
    )