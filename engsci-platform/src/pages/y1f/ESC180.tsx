const ESC180 = () => {
  return (
    <div className="w-full h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] flex flex-col">
      <div className="relative flex-grow w-full">
        <ReactFlowProvider>
          <FlowChart />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ESC180;
