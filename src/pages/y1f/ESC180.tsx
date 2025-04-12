import { useState, useEffect } from "react";
import CourseDependencyGraph, {
  GraphNode,
  GraphEdge,
} from "../../components/roadmap/CourseDependencyGraph";
import roadmapData from "../../data/roadmaps/ESC180.json";
import problemsData from "../../data/problems/ESC180.json";
import { mergeCourseData } from "../../utils/courseDataUtils";

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const ESC180 = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  useEffect(() => {
    // Merge roadmap data with problems data
    const mergedData = mergeCourseData(roadmapData as GraphData, problemsData);

    setNodes(mergedData.nodes);
    setEdges(mergedData.edges);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      <CourseDependencyGraph
        nodes={nodes}
        edges={edges}
        title="ESC180"
        semester="y1f"
      />
    </div>
  );
};

export default ESC180;
