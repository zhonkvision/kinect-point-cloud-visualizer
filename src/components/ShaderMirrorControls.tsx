
import React from "react";
import { DraggablePanel } from "@/components/ui/draggable-panel";
import { Switch } from "@/components/ui/switch";
import { Eye, FlipHorizontal } from "lucide-react";

interface ShaderMirrorControlsProps {
  onToggleShaderEffect?: () => void;
  onToggleMirrorView?: () => void;
  useShaderEffect?: boolean;
  isMirroredView?: boolean;
  visible: boolean;
  isVideoActive: boolean;
}

const ShaderMirrorControls: React.FC<ShaderMirrorControlsProps> = ({
  onToggleShaderEffect,
  onToggleMirrorView,
  useShaderEffect,
  isMirroredView,
  visible,
  isVideoActive,
}) => {
  if (!visible) return null;

  return (
    <DraggablePanel
      id="shader-mirror-controls"
      title="SHADER & MIRROR"
      icon={<Eye size={16} className="text-purple-500" />}
      defaultPosition={{ x: 20, y: 300 }}
      defaultSize={{ width: 300, height: "auto" }}
    >
      <div className="space-y-3">
        {onToggleShaderEffect && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-purple-400" />
              <span className="text-sm text-purple-300 font-mono">
                {useShaderEffect ? "Shader Mode" : "Standard Mode"}
              </span>
            </div>
            <Switch
              checked={!!useShaderEffect}
              onCheckedChange={onToggleShaderEffect}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        )}

        {onToggleMirrorView && (
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

        <div className="text-xs text-cyan-400 mt-2 p-2 bg-black/30 rounded border border-cyan-500/20">
          <p className="font-mono">
            {isVideoActive ? "Works with webcam and video" : "Available for all sources"}
          </p>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default ShaderMirrorControls;
