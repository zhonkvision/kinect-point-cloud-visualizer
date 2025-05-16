
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye } from "lucide-react";
import { DraggablePanel } from "@/components/ui/draggable-panel";

interface CameraControlsProps {
  onToggleAutoRotate: () => void;
  onToggleShaderEffect?: () => void;
  isAutoRotating: boolean;
  isWebcamActive: boolean;
  useShaderEffect?: boolean;
  visible: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onToggleAutoRotate,
  onToggleShaderEffect,
  isAutoRotating,
  isWebcamActive,
  useShaderEffect,
  visible,
}) => {
  if (!visible) return null;

  return (
    <DraggablePanel
      id="camera-controls"
      title="CAMERA CONTROLS"
      icon={<RotateCcw size={16} className="text-cyan-500" />}
      defaultPosition={{ x: 20, y: 160 }}
      defaultSize={{ width: 300, height: 'auto' }}
    >
      <div className="space-y-3">
        {!isAutoRotating ? (
          <Button
            variant="outline"
            className="w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200"
            onClick={onToggleAutoRotate}
          >
            <RotateCcw size={16} className="mr-2" />
            Enable Auto-Rotation
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-orange-500/30 bg-orange-900/20 text-orange-300 hover:bg-orange-900/30 hover:text-orange-100 transition-all duration-200"
            onClick={onToggleAutoRotate}
          >
            <RotateCcw size={16} className="mr-2" />
            Disable Auto-Rotation
          </Button>
        )}

        {isWebcamActive && onToggleShaderEffect && (
          <Button
            variant="outline"
            className={`w-full border-purple-500/30 ${useShaderEffect ? "bg-purple-900/20" : "bg-black/50"} text-purple-300 hover:bg-purple-900/30 hover:text-purple-100 transition-all duration-200`}
            onClick={onToggleShaderEffect}
          >
            <Eye size={16} className="mr-2" />
            {useShaderEffect ? "Use Kinect Mode" : "Use Shader Mode"}
          </Button>
        )}
      </div>
    </DraggablePanel>
  );
};

export default CameraControls;
