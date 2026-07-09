"""Dependency parser for TypeScript."""

from app.services.parsers.javascript_parser import (
    JavaScriptParser,
)


class TypeScriptParser(JavaScriptParser):
    """TypeScript uses the same import syntax as JavaScript."""

    pass