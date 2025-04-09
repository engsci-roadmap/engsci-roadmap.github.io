import { useState, useEffect } from "react";
import CourseDependencyGraph, {
  GraphNode,
  GraphEdge,
} from "../../components/roadmap/CourseDependencyGraph";
import graphData from "../../data/roadmaps/MIE286.json";

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const MIE286 = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  useEffect(() => {
    // Load the graph data from the JSON file
    const typedData = graphData as GraphData;
    setNodes(typedData.nodes);
    setEdges(typedData.edges);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      <CourseDependencyGraph nodes={nodes} edges={edges} title="MIE286" />
    </div>
  );
};

export default MIE286;
