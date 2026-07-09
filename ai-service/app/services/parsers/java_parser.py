"""Dependency parser for Java."""

import re

from app.services.parsers.base_parser import DependencyParser


IMPORT_PATTERN = re.compile(
    r'import\s+([\w\.]+);'
)


class JavaParser(DependencyParser):
    """Extract imports from Java files."""

    def parse_imports(self, content: str, current_file: str,) -> list[str]:
        return IMPORT_PATTERN.findall(content)