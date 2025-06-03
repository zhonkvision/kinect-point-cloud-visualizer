
import React from "react";
import { Slider } from "@/components/ui/slider";
import { VisualizerControls } from "./KinectVisualizer";
import { SlidersVertical } from "lucide-react";
import { DraggablePanel } from "@/components/ui/draggable-panel";

interface VisualizationControlsProps {
  controls: VisualizerControls;
  onControlsChange: (controlName: string, value: number) => void;
  visible: boolean;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  controls,
  onControlsChange,
  visible,
}) => {
  if (!visible) return null;

  const controlItems = [
    { name: "nearClipping", label: "Near Clipping", min: 1, max: 10000, step: 1 },
    { name: "farClipping", label: "Far Clipping", min: 1, max: 10000, step: 1 },
    { name: "pointSize", label: "Point Size", min: 1, max: 10, step: 0.1 },
    { name: "zOffset", label: "Z Offset", min: 0, max: 4000, step: 1 },
    { name: "opacity", label: "Opacity", min: 0, max: 1, step: 0.01 },
    { name: "hueShift", label: "Hue Shift", min: 0, max: 1, step: 0.01 }
  ];

  return (
    <DraggablePanel
      id="visualization-controls"
      title="PARAMETERS"
      icon={<SlidersVertical size={16} className="text-cyan-500" />}
      defaultPosition={{ x: 20, y: 300 }}
      defaultSize={{ width: 280, height: "auto" }}
    >
      <div className="space-y-4">
        {controlItems.map((item) => (
          <div key={item.name} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-cyan-400 font-mono font-medium tracking-wide uppercase">
                {item.label}
              </label>
              <span className="text-xs text-cyan-200 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/50">
                {item.name.includes("opacity") || item.name.includes("hueShift")
                  ? (controls[item.name as keyof VisualizerControls] as number).toFixed(2)
                  : controls[item.name as keyof VisualizerControls]}
              </span>
            </div>
            <div className="relative">
              <Slider
                className="professional-slider"
                value={[controls[item.name as keyof VisualizerControls] as number]}
                min={item.min}
                max={item.max}
                step={item.step}
                onValueChange={(value) => onControlsChange(item.name, value[0])}
              />
              <div className="flex justify-between mt-1 text-[10px] text-cyan-600 font-mono">
                <span>{item.min}</span>
                <span>{item.max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DraggablePanel>
  );
};

export default VisualizationControls;
