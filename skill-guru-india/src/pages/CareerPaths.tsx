import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoadmapGenerator from '../components/RoadmapGenerator';
import RoadmapVisualizer from '../components/RoadmapVisualizer';
import NodeDetailsPanel from '../components/NodeDetailsPanel';
import Header from '../components/Nodeheader';
import { generateSessionId } from '../utils/helpers';


function CareerPaths() {
  const [roadmapData, setRoadmapData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const detailsPanelRef = useRef(null);

  const handleRoadmapGenerated = (data) => {
    setRoadmapData(data);
    toast.success('🎉 Your personalized roadmap is ready!');
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    // Smooth scroll to details panel
    if (detailsPanelRef.current) {
      detailsPanelRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleReset = () => {
    setRoadmapData(null);
    setSelectedNode(null);
    toast.info('🔄 Session reset. Ready for a new roadmap!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onReset={handleReset} hasRoadmap={!!roadmapData} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Generator Section */}
        <div className="mb-12">
          <RoadmapGenerator
            sessionId={sessionId}
            onRoadmapGenerated={handleRoadmapGenerated}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            existingRoadmap={roadmapData}
          />
        </div>

        {/* Roadmap Visualization */}
        {roadmapData && (
          <div className="mb-12">
            <RoadmapVisualizer
              roadmapData={roadmapData}
              onNodeClick={handleNodeClick}
              selectedNode={selectedNode}
            />
          </div>
        )}

        {/* Node Details Panel */}
        {selectedNode && (
          <div ref={detailsPanelRef} className="mb-12">
            <NodeDetailsPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default CareerPaths;
