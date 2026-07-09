from app.services.parsers.java_parser import JavaParser
from app.services.parsers.javascript_parser import JavaScriptParser
from app.services.parsers.python_parser import PythonParser
from app.services.parsers.typescript_parser import TypeScriptParser

PARSERS = {
    ".py": PythonParser(),
    ".js": JavaScriptParser(),
    ".jsx": JavaScriptParser(),
    ".ts": TypeScriptParser(),
    ".tsx": TypeScriptParser(),
    ".java": JavaParser(),
}