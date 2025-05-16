
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye, FlipHorizontal } from "lucide-react";
import { DraggablePanel } from "@/components/ui/draggable-panel";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

interface CameraControlsProps {
  onToggleAutoRotate: () => void;
  onToggleShaderEffect?: () => void;
  onToggleMirrorView?: () => void;
  isAutoRotating: boolean;
  isWebcamActive: boolean;
  useShaderEffect?: boolean;
  isMirroredView?: boolean;
  visible: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onToggleAutoRotate,
  onToggleShaderEffect,
  onToggleMirrorView,
  isAutoRotating,
  isWebcamActive,
  useShaderEffect,
  isMirroredView,
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
            <span className="text-sm text-cyan-300 font-mono">Rotate {isAutoRotating ? "Off" : "On"}</span>
          </div>
          <Switch
            checked={isAutoRotating}
            onCheckedChange={onToggleAutoRotate}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>

        {isWebcamActive && onToggleShaderEffect && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-purple-400" />
              <span className="text-sm text-purple-300 font-mono">
                {useShaderEffect ? "Shader Mode" : "Kinect Mode"}
              </span>
            </div>
            <Switch
              checked={!!useShaderEffect}
              onCheckedChange={onToggleShaderEffect}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        )}

        {isWebcamActive && onToggleMirrorView && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlipHorizontal size={16} className="text-green-400" />
              <span className="text-sm text-green-300 font-mono">Mirror View</span>
            </div>
            <Switch
              checked={!!isMirroredView}
              onCheckedChange={onToggleMirrorView}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default CameraControls;
