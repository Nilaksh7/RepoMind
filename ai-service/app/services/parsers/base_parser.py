"""Base interface for dependency parsers."""

from abc import ABC, abstractmethod


class DependencyParser(ABC):
    """Abstract base class for language-specific dependency parsers."""

    @abstractmethod
    def parse_imports(self, content: str, current_file: str,) -> list[str]:
        """Extract imported modules from source code."""
        raise NotImplementedError