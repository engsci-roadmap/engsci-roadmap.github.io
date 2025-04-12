import { useState, useEffect } from "react";
import CourseDependencyGraph, {
  GraphNode,
  GraphEdge,
} from "../../components/roadmap/CourseDependencyGraph";
import roadmapData from "../../data/roadmaps/MIE286.json";
import problemsData from "../../data/problems/MIE286.json";
import { mergeCourseData } from "../../utils/courseDataUtils";

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const MIE286 = () => {
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
        title="MIE286"
        semester="y2w"
      />
    </div>
  );
};

export default MIE286;
