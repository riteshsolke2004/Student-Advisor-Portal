import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import RoadmapVisualization from "../components/RoadmapVisualization";
import Chatbot from "../components/Chatbot";

interface CareerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapData: any;
  careerTitle: string;
}

const CareerRoadmapModal: React.FC<CareerRoadmapModalProps> = ({ 
  isOpen, 
  onClose, 
  roadmapData, 
  careerTitle 
}) => {
  const downloadRoadmap = () => {
    const dataStr = JSON.stringify(roadmapData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${careerTitle}_roadmap.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!roadmapData) return null;

  return (
    <>
  
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 sticky top-0 bg-background z-10">
     
          <DialogTitle className="text-2xl font-bold">
            Interactive Learning Roadmap
          </DialogTitle>
          <div className="flex space-x-2">
            
            <Button variant="outline" size="sm" onClick={downloadRoadmap}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
       
        <RoadmapVisualization roadmapData={roadmapData} />
      </DialogContent>
       <div className="absolute left-6 bottom-6 z-50">
    
  </div>
    </Dialog>
 
    </>
  );
};

export default CareerRoadmapModal;
