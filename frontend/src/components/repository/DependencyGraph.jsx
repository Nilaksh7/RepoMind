import { useEffect, useMemo, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
} from "reactflow";

import dagre from "dagre";

import "reactflow/dist/style.css";

import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

import DependencyNode from "./DependencyNode";

import { getDependencyGraph } from "../../services/repository.service";

const nodeTypes = {
  dependency: DependencyNode,
};

const NODE_WIDTH = 230;
const NODE_HEIGHT = 80;

function getLayoutedElements(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    ranksep: 140,
    nodesep: 70,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const position = graph.node(node.id);

      return {
        ...node,
        position: {
          x: position.x - NODE_WIDTH / 2,
          y: position.y - NODE_HEIGHT / 2,
        },
      };
    }),
    edges,
  };
}

export default function DependencyGraph({ repositoryId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGraph();
  }, [repositoryId]);

  async function loadGraph() {
    try {
      setIsLoading(true);
      setError("");

      const graph = await getDependencyGraph(repositoryId);

      const flowNodes = graph.nodes.map((node) => ({
        id: node.id,

        type: "dependency",

        position: { x: 0, y: 0 },

        data: {
          label: node.label,
          path: node.id,
          type: node.type,
        },
      }));

      const flowEdges = graph.edges.map((edge, index) => ({
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,

        animated: false,

        type: "smoothstep",

        markerEnd: {
          type: MarkerType.ArrowClosed,
        },

        style: {
          stroke: "#64748b",
          strokeWidth: 2,
        },
      }));

      const layoutedGraph = getLayoutedElements(flowNodes, flowEdges);

      const nodeIds = new Set(layoutedGraph.nodes.map((n) => n.id));

      const invalidEdges = layoutedGraph.edges.filter(
        (e) => !nodeIds.has(e.source) || !nodeIds.has(e.target),
      );

      console.log("Invalid edges:", invalidEdges.length);

      setNodes(layoutedGraph.nodes);
      setEdges(layoutedGraph.edges);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to load dependency graph.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const graph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  if (isLoading) {
    return <LoadingState message="Generating dependency graph..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-[650px] items-center justify-center text-slate-400">
        No supported source files were found.
      </div>
    );
  }

  const languageCounts = graph.nodes.reduce((acc, node) => {
    const extension = node.data.type;

    acc[extension] = (acc[extension] || 0) + 1;

    return acc;
  }, {});

  return (
    <div className="h-[700px] rounded-xl border border-slate-800 bg-slate-950">
      <div className="flex flex-wrap gap-5 border-b border-slate-800 px-5 py-3 text-sm text-slate-300">
        <span>
          📄 <strong>{graph.nodes.length}</strong> Files
        </span>

        <span>
          🔗 <strong>{graph.edges.length}</strong> Dependencies
        </span>

        {Object.entries(languageCounts).map(([language, count]) => (
          <span key={language}>
            <strong>{language.toUpperCase()}</strong>: {count}
          </span>
        ))}
      </div>

      <div className="h-[640px]">
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.25,
          }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{
            hideAttribution: true,
          }}
        >
          <MiniMap
            pannable
            zoomable
            nodeStrokeWidth={3}
            maskColor="rgba(15,23,42,0.65)"
          />

          <Controls showInteractive />

          <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} />
        </ReactFlow>
      </div>
    </div>
  );
}
