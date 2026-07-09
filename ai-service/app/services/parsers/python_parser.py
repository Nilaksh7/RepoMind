"""Dependency parser for Python."""

import ast

from app.services.parsers.base_parser import DependencyParser


class PythonParser(DependencyParser):
    """Extract imports from Python files."""

    def parse_imports(self, content: str, current_file: str,) -> list[str]:
        imports: list[str] = []

        try:
            tree = ast.parse(content)
        except SyntaxError:
            return imports

        for node in ast.walk(tree):

            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)

            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)

        return imports