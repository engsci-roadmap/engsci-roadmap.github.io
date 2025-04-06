import { ReactFlowProvider } from "reactflow";
import FlowChart from "../../components/roadmap/FlowChart";

const ESC180 = () => {
  return (
    <div className="w-full h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] flex flex-col">
      <div className="relative flex-grow w-full overflow-hidden touch-auto">
        <ReactFlowProvider>
          <FlowChart jsonPath="../../data/roadmaps/ESC180.json" />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ESC180;
