
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Video, 
  Download, 
  RotateCcw, 
  Webcam,
  SlidersVertical,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CyberpunkSidebarProps {
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

const CyberpunkSidebar: React.FC<CyberpunkSidebarProps> = ({
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
  const [collapsed, setCollapsed] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full backdrop-blur-md transition-all duration-300 z-20 flex flex-col",
        collapsed 
          ? "w-16 bg-black/70 border-r border-cyan-500/20" 
          : "w-56 bg-black/70 border-r border-cyan-500/20"
      )}
      style={{
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)'
      }}
    >
      <div className="flex justify-between items-center p-3 border-b border-cyan-500/30 backdrop-blur-md">
        <div className={cn("text-cyan-400 font-mono font-bold tracking-wider text-sm", collapsed ? "hidden" : "block")}>
          ZHONK VISION
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-cyan-400 hover:text-cyan-300 hover:bg-purple-900/20" 
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto">
        <div className={cn("space-y-2", collapsed ? "items-center flex flex-col" : "")}>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200",
              collapsed ? "justify-center p-2" : ""
            )}
            onClick={onUploadClick}
          >
            <Upload size={collapsed ? 18 : 16} />
            {!collapsed && <span className="ml-2 text-xs">UPLOAD VIDEO</span>}
          </Button>
          
          {isWebcamActive ? (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-red-500/30 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleWebcam}
            >
              <Webcam size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">STOP WEBCAM</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-green-500/30 bg-black/50 text-green-300 hover:bg-green-900/30 hover:text-green-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleWebcam}
            >
              <Webcam size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">START WEBCAM</span>}
            </Button>
          )}
          
          {!isRecording ? (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onRecordClick}
            >
              <Video size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">RECORD OUTPUT</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-red-500/30 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onStopRecordClick}
            >
              <Video size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">STOP RECORDING</span>}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200",
              collapsed ? "justify-center p-2" : "",
              !canDownload ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={onDownloadClick}
            disabled={!canDownload}
          >
            <Download size={collapsed ? 18 : 16} />
            {!collapsed && <span className="ml-2 text-xs">DOWNLOAD VIDEO</span>}
          </Button>
          
          {!isAutoRotating ? (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleAutoRotate}
            >
              <RotateCcw size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">AUTO-ROTATE</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-orange-500/30 bg-orange-900/20 text-orange-300 hover:bg-orange-900/30 hover:text-orange-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleAutoRotate}
            >
              <RotateCcw size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">STOP ROTATION</span>}
            </Button>
          )}

          {/* Effect toggle button for webcam */}
          {isWebcamActive && onToggleShaderEffect && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-purple-500/30 bg-black/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : "",
                useShaderEffect ? "bg-purple-900/20" : ""
              )}
              onClick={onToggleShaderEffect}
            >
              <Eye size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">{useShaderEffect ? "KINECT MODE" : "SHADER MODE"}</span>}
            </Button>
          )}
          
          {/* Controls toggle button */}
          {!isWebcamActive && controls && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200",
                collapsed ? "justify-center p-2" : "",
                showControls ? "bg-cyan-900/20" : ""
              )}
              onClick={toggleControls}
            >
              <SlidersVertical size={collapsed ? 18 : 16} />
              {!collapsed && <span className="ml-2 text-xs">{showControls ? "HIDE CONTROLS" : "SHOW CONTROLS"}</span>}
            </Button>
          )}
        </div>

        {/* Control parameters section */}
        {showControls && !collapsed && controls && (
          <div className="mt-4 space-y-4 border-t border-cyan-500/30 pt-4">
            <div className="space-y-2">
              <label className="block text-xs text-cyan-400">Near Clipping</label>
              <Slider 
                className="cyberpunk-slider" 
                value={[controls.nearClipping]}
                min={1} 
                max={10000} 
                step={1} 
                onValueChange={(value) => onControlsChange('nearClipping', value[0])}
              />
              <div className="text-right text-xs text-cyan-300">{controls.nearClipping}</div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-cyan-400">Far Clipping</label>
              <Slider 
                className="cyberpunk-slider" 
                value={[controls.farClipping]} 
                min={1} 
                max={10000}
                step={1}
                onValueChange={(value) => onControlsChange('farClipping', value[0])}
              />
              <div className="text-right text-xs text-cyan-300">{controls.farClipping}</div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-cyan-400">Point Size</label>
              <Slider 
                className="cyberpunk-slider" 
                value={[controls.pointSize]} 
                min={1} 
                max={10}
                step={0.1}
                onValueChange={(value) => onControlsChange('pointSize', value[0])}
              />
              <div className="text-right text-xs text-cyan-300">{controls.pointSize}</div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-cyan-400">Z Offset</label>
              <Slider 
                className="cyberpunk-slider" 
                value={[controls.zOffset]} 
                min={0} 
                max={4000}
                step={1}
                onValueChange={(value) => onControlsChange('zOffset', value[0])}
              />
              <div className="text-right text-xs text-cyan-300">{controls.zOffset}</div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-cyan-400">Opacity</label>
              <Slider 
                className="cyberpunk-slider" 
                value={[controls.opacity]} 
                min={0} 
                max={1}
                step={0.01}
                onValueChange={(value) => onControlsChange('opacity', value[0])}
              />
              <div className="text-right text-xs text-cyan-300">{controls.opacity.toFixed(2)}</div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-cyan-400">Hue Shift</label>
              <Slider 
                className="cyberpunk-slider" 
                value={[controls.hueShift]} 
                min={0} 
                max={1}
                step={0.01}
                onValueChange={(value) => onControlsChange('hueShift', value[0])}
              />
              <div className="text-right text-xs text-cyan-300">{controls.hueShift.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CyberpunkSidebar;
