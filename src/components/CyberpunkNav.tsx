
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Video, 
  Download, 
  RotateCcw, 
  Webcam,
  SlidersVertical,
  Eye,
  X,
  Menu
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible"

interface CyberpunkNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onUploadClick: () => void;
  onRecordClick: () => void;
  onStopRecordClick: () => void;
  onDownloadClick: () => void;
  onToggleAutoRotate: () => void;
  onToggleWebcam: () => void;
  onToggleShaderEffect?: () => void;
  onControlsChange: (controlName: string, value: number) => void;
  isRecording: boolean;
  isAutoRotating: boolean;
  isWebcamActive: boolean;
  useShaderEffect?: boolean;
  canDownload: boolean;
  controls?: {
    nearClipping: number;
    farClipping: number;
    pointSize: number;
    zOffset: number;
    opacity: number;
    hueShift: number;
  };
}

const CyberpunkNav: React.FC<CyberpunkNavProps> = ({
  isOpen,
  onToggle,
  onUploadClick,
  onRecordClick,
  onStopRecordClick,
  onDownloadClick,
  onToggleAutoRotate,
  onToggleWebcam,
  onToggleShaderEffect,
  onControlsChange,
  isRecording,
  isAutoRotating,
  isWebcamActive,
  useShaderEffect,
  canDownload,
  controls
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={onToggle}
        className="fixed z-50 bottom-8 right-8 w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
        aria-label="Open Navigation"
      >
        <Menu className="w-6 h-6 text-cyan-400" />
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onToggle} />
      
      {/* Main navigation panel */}
      <div 
        className="absolute right-0 top-0 h-full max-w-full w-[28rem] bg-black/75 backdrop-blur-md border-l border-cyan-500/30 pointer-events-auto shadow-[0_0_30px_rgba(0,255,255,0.2)] translate-x-0 transition-transform duration-300"
        style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
      >
        {/* Nav header */}
        <div className="flex justify-between items-center p-4 border-b border-cyan-500/30">
          <h2 className="text-cyan-400 font-mono font-bold tracking-wider text-lg flex items-center gap-2">
            <SlidersVertical size={20} className="text-cyan-500" />
            ZHONK VISION <span className="text-xs text-cyan-500/70">v2.0</span>
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-purple-900/20 h-10 w-10 p-0" 
          >
            <X size={20} />
          </Button>
        </div>

        {/* Nav content */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-cyan-900/50">
          {/* Main controls section */}
          <div className="relative border border-cyan-500/30 rounded-md overflow-hidden">
            <div className="bg-cyan-950/30 px-4 py-3 font-mono text-cyan-400 uppercase text-sm font-bold flex items-center gap-2">
              <Video size={16} className="text-cyan-500" />
              Input/Output
            </div>
            <div className="p-4 space-y-3">
              <Button
                variant="outline"
                className="w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200"
                onClick={onUploadClick}
              >
                <Upload size={16} className="mr-2" />
                Upload Video
              </Button>
              
              {isWebcamActive ? (
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-all duration-200"
                  onClick={onToggleWebcam}
                >
                  <Webcam size={16} className="mr-2" />
                  Stop Webcam
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-green-500/30 bg-black/50 text-green-300 hover:bg-green-900/30 hover:text-green-100 transition-all duration-200"
                  onClick={onToggleWebcam}
                >
                  <Webcam size={16} className="mr-2" />
                  Start Webcam
                </Button>
              )}
              
              {!isRecording ? (
                <Button
                  variant="outline"
                  className="w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200"
                  onClick={onRecordClick}
                >
                  <Video size={16} className="mr-2" />
                  Record Output
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-all duration-200"
                  onClick={onStopRecordClick}
                >
                  <Video size={16} className="mr-2" />
                  Stop Recording
                </Button>
              )}
              
              <Button
                variant="outline"
                className={cn(
                  "w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200",
                  !canDownload && "opacity-50 cursor-not-allowed"
                )}
                onClick={onDownloadClick}
                disabled={!canDownload}
              >
                <Download size={16} className="mr-2" />
                Download Video
              </Button>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="relative border border-cyan-500/30 rounded-md overflow-hidden">
            <div className="bg-cyan-950/30 px-4 py-3 font-mono text-cyan-400 uppercase text-sm font-bold flex items-center gap-2">
              <RotateCcw size={16} className="text-cyan-500" />
              Camera Controls
            </div>
            <div className="p-4 space-y-3">
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

              {/* Effect toggle button for webcam */}
              {isWebcamActive && onToggleShaderEffect && (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full border-purple-500/30 bg-black/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-100 transition-all duration-200",
                    useShaderEffect ? "bg-purple-900/20" : ""
                  )}
                  onClick={onToggleShaderEffect}
                >
                  <Eye size={16} className="mr-2" />
                  {useShaderEffect ? "Use Kinect Mode" : "Use Shader Mode"}
                </Button>
              )}
            </div>
          </div>

          {/* Visualization Parameters */}
          {controls && (
            <Collapsible className="relative border border-cyan-500/30 rounded-md overflow-hidden">
              <div className="bg-cyan-950/30 px-4 py-3 font-mono text-cyan-400 uppercase text-sm font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersVertical size={16} className="text-cyan-500" />
                  Visualization Parameters
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50">
                    <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="p-4 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-cyan-400 font-mono">Near Clipping</label>
                      <span className="text-xs text-cyan-300 font-mono">{controls.nearClipping}</span>
                    </div>
                    <Slider 
                      className="cyberpunk-slider" 
                      value={[controls.nearClipping]}
                      min={1} 
                      max={10000} 
                      step={1} 
                      onValueChange={(value) => onControlsChange('nearClipping', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-cyan-400 font-mono">Far Clipping</label>
                      <span className="text-xs text-cyan-300 font-mono">{controls.farClipping}</span>
                    </div>
                    <Slider 
                      className="cyberpunk-slider" 
                      value={[controls.farClipping]} 
                      min={1} 
                      max={10000}
                      step={1}
                      onValueChange={(value) => onControlsChange('farClipping', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-cyan-400 font-mono">Point Size</label>
                      <span className="text-xs text-cyan-300 font-mono">{controls.pointSize}</span>
                    </div>
                    <Slider 
                      className="cyberpunk-slider" 
                      value={[controls.pointSize]} 
                      min={1} 
                      max={10}
                      step={0.1}
                      onValueChange={(value) => onControlsChange('pointSize', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-cyan-400 font-mono">Z Offset</label>
                      <span className="text-xs text-cyan-300 font-mono">{controls.zOffset}</span>
                    </div>
                    <Slider 
                      className="cyberpunk-slider" 
                      value={[controls.zOffset]} 
                      min={0} 
                      max={4000}
                      step={1}
                      onValueChange={(value) => onControlsChange('zOffset', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-cyan-400 font-mono">Opacity</label>
                      <span className="text-xs text-cyan-300 font-mono">{controls.opacity.toFixed(2)}</span>
                    </div>
                    <Slider 
                      className="cyberpunk-slider" 
                      value={[controls.opacity]} 
                      min={0} 
                      max={1}
                      step={0.01}
                      onValueChange={(value) => onControlsChange('opacity', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-cyan-400 font-mono">Hue Shift</label>
                      <span className="text-xs text-cyan-300 font-mono">{controls.hueShift.toFixed(2)}</span>
                    </div>
                    <Slider 
                      className="cyberpunk-slider" 
                      value={[controls.hueShift]} 
                      min={0} 
                      max={1}
                      step={0.01}
                      onValueChange={(value) => onControlsChange('hueShift', value[0])}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Technical overlay info */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="border-t border-cyan-500/20 mt-4 pt-4">
              <div className="text-xs text-cyan-400/50 font-mono tracking-tight space-y-1">
                <div className="flex justify-between">
                  <span>SYS_STATUS</span>
                  <span className="text-cyan-300/70">OPERATIONAL</span>
                </div>
                <div className="flex justify-between">
                  <span>MEM_ALLOC</span>
                  <span className="text-cyan-300/70">1.32GB</span>
                </div>
                <div className="flex justify-between">
                  <span>FRAME_BUFFER</span>
                  <span className="text-cyan-300/70">STABLE</span>
                </div>
                <div className="flex justify-between">
                  <span>NET_SYNC</span>
                  <span className="text-cyan-300/70">ESTABLISHED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkNav;
