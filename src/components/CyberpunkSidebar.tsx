
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload, Video, Download, RotateCcw, Webcam } from "lucide-react";
import { cn } from "@/lib/utils";

interface CyberpunkSidebarProps {
  onUploadClick: () => void;
  onRecordClick: () => void;
  onStopRecordClick: () => void;
  onDownloadClick: () => void;
  onToggleAutoRotate: () => void;
  onToggleWebcam: () => void;
  isRecording: boolean;
  isAutoRotating: boolean;
  isWebcamActive: boolean;
  canDownload: boolean;
}

const CyberpunkSidebar: React.FC<CyberpunkSidebarProps> = ({
  onUploadClick,
  onRecordClick,
  onStopRecordClick,
  onDownloadClick,
  onToggleAutoRotate,
  onToggleWebcam,
  isRecording,
  isAutoRotating,
  isWebcamActive,
  canDownload
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-black/80 backdrop-blur-sm transition-all duration-300 z-20 flex flex-col",
        collapsed ? "w-14" : "w-56"
      )}
    >
      <div className="flex justify-between items-center p-3 border-b border-purple-500/30">
        <div className={cn("text-cyan-400 font-mono text-xs font-bold", collapsed ? "hidden" : "block")}>
          ZHONK
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-cyan-400 hover:text-cyan-300 hover:bg-purple-900/20" 
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto">
        <div className={cn("space-y-2 mt-2", collapsed ? "items-center flex flex-col" : "")}>
          <Button
            variant="outline"
            className={cn(
              "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 py-1 h-8",
              collapsed ? "justify-center p-1.5" : "text-xs"
            )}
            onClick={onUploadClick}
          >
            <Upload size={collapsed ? 16 : 14} />
            {!collapsed && <span className="ml-2">UPLOAD</span>}
          </Button>
          
          {isWebcamActive ? (
            <Button
              variant="outline"
              className={cn(
                "w-full border-red-500/50 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100 py-1 h-8",
                collapsed ? "justify-center p-1.5" : "text-xs"
              )}
              onClick={onToggleWebcam}
            >
              <Webcam size={collapsed ? 16 : 14} />
              {!collapsed && <span className="ml-2">STOP CAM</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full border-green-500/50 bg-purple-900/20 text-green-300 hover:bg-green-900/30 hover:text-green-100 py-1 h-8",
                collapsed ? "justify-center p-1.5" : "text-xs"
              )}
              onClick={onToggleWebcam}
            >
              <Webcam size={collapsed ? 16 : 14} />
              {!collapsed && <span className="ml-2">START CAM</span>}
            </Button>
          )}
          
          {!isRecording ? (
            <Button
              variant="outline"
              className={cn(
                "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 py-1 h-8",
                collapsed ? "justify-center p-1.5" : "text-xs"
              )}
              onClick={onRecordClick}
            >
              <Video size={collapsed ? 16 : 14} />
              {!collapsed && <span className="ml-2">RECORD</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full border-red-500/50 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100 py-1 h-8",
                collapsed ? "justify-center p-1.5" : "text-xs"
              )}
              onClick={onStopRecordClick}
            >
              <Video size={collapsed ? 16 : 14} />
              {!collapsed && <span className="ml-2">STOP</span>}
            </Button>
          )}
          
          <Button
            variant="outline"
            className={cn(
              "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 py-1 h-8",
              collapsed ? "justify-center p-1.5" : "text-xs",
              !canDownload ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={onDownloadClick}
            disabled={!canDownload}
          >
            <Download size={collapsed ? 16 : 14} />
            {!collapsed && <span className="ml-2">DOWNLOAD</span>}
          </Button>
          
          {!isAutoRotating ? (
            <Button
              variant="outline"
              className={cn(
                "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 py-1 h-8",
                collapsed ? "justify-center p-1.5" : "text-xs"
              )}
              onClick={onToggleAutoRotate}
            >
              <RotateCcw size={collapsed ? 16 : 14} />
              {!collapsed && <span className="ml-2">ROTATE</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full border-orange-500/50 bg-orange-900/20 text-orange-300 hover:bg-orange-900/30 hover:text-orange-100 py-1 h-8",
                collapsed ? "justify-center p-1.5" : "text-xs"
              )}
              onClick={onToggleAutoRotate}
            >
              <RotateCcw size={collapsed ? 16 : 14} />
              {!collapsed && <span className="ml-2">STOP ROT</span>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberpunkSidebar;
