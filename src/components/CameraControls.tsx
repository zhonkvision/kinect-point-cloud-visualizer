
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { DraggablePanel } from "@/components/ui/draggable-panel";
import { Switch } from "@/components/ui/switch";

interface CameraControlsProps {
  onToggleAutoRotate: () => void;
  isAutoRotating: boolean;
  visible: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onToggleAutoRotate,
  isAutoRotating,
  visible,
}) => {
  if (!visible) return null;

  return (
    <DraggablePanel
      id="camera-controls"
      title="CAMERA CONTROLS"
      icon={<RotateCcw size={16} className="text-cyan-500" />}
      defaultPosition={{ x: 20, y: 160 }}
      defaultSize={{ width: 300, height: "auto" }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw size={16} className="text-cyan-400" />
            <span className="text-sm text-cyan-300 font-mono">Auto Rotate</span>
          </div>
          <Switch
            checked={isAutoRotating}
            onCheckedChange={onToggleAutoRotate}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
      </div>
    </DraggablePanel>
  );
};

export default CameraControls;
