from pydantic import BaseModel


class GraphNode(BaseModel):
    id: str
    label: str
    type: str


class GraphEdge(BaseModel):
    source: str
    target: str


class DependencyGraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]