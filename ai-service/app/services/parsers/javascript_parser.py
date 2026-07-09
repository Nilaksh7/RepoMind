"""Dependency parser for JavaScript and TypeScript."""

import re

from app.services.parsers.base_parser import DependencyParser


IMPORT_PATTERN = re.compile(
    r'import\s+(?:[\s\S]*?\s+from\s+)?[\'"](.+?)[\'"]'
)

EXPORT_PATTERN = re.compile(
    r'export\s+(?:[\s\S]*?\s+from\s+)[\'"](.+?)[\'"]'
)

REQUIRE_PATTERN = re.compile(
    r'require\(\s*[\'"](.+?)[\'"]\s*\)'
)

DYNAMIC_IMPORT_PATTERN = re.compile(
    r'import\(\s*[\'"](.+?)[\'"]\s*\)'
)


class JavaScriptParser(DependencyParser):
    """Extract module dependencies from JavaScript/TypeScript."""

    def parse_imports(
        self,
        content: str,
        current_file: str,
    ) -> list[str]:

        imports: list[str] = []

        imports.extend(IMPORT_PATTERN.findall(content))
        imports.extend(EXPORT_PATTERN.findall(content))
        imports.extend(REQUIRE_PATTERN.findall(content))
        imports.extend(DYNAMIC_IMPORT_PATTERN.findall(content))

        seen = set()
        unique_imports = []

        for imported in imports:

            if imported not in seen:
                seen.add(imported)
                unique_imports.append(imported)

        return unique_imports