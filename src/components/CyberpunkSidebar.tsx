
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
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-purple-500/30">
        <div className={cn("text-cyan-400 font-mono font-bold", collapsed ? "hidden" : "block")}>
          ZHONK PANEL
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-cyan-400 hover:text-cyan-300 hover:bg-purple-900/20" 
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
        <div className={cn("space-y-3 mt-4", collapsed ? "items-center flex flex-col" : "")}>
          <Button
            variant="outline"
            className={cn(
              "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100",
              collapsed ? "justify-center p-2" : ""
            )}
            onClick={onUploadClick}
          >
            <Upload size={collapsed ? 24 : 18} />
            {!collapsed && <span className="ml-2">Upload Video</span>}
          </Button>
          
          {isWebcamActive ? (
            <Button
              variant="outline"
              className={cn(
                "w-full border-red-500/50 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleWebcam}
            >
              <Webcam size={collapsed ? 24 : 18} />
              {!collapsed && <span className="ml-2">Stop Webcam</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full border-green-500/50 bg-purple-900/20 text-green-300 hover:bg-green-900/30 hover:text-green-100",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleWebcam}
            >
              <Webcam size={collapsed ? 24 : 18} />
              {!collapsed && <span className="ml-2">Start Webcam</span>}
            </Button>
          )}
          
          {!isRecording ? (
            <Button
              variant="outline"
              className={cn(
                "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onRecordClick}
            >
              <Video size={collapsed ? 24 : 18} />
              {!collapsed && <span className="ml-2">Record Output</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full border-red-500/50 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-100",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onStopRecordClick}
            >
              <Video size={collapsed ? 24 : 18} />
              {!collapsed && <span className="ml-2">Stop Recording</span>}
            </Button>
          )}
          
          <Button
            variant="outline"
            className={cn(
              "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100",
              collapsed ? "justify-center p-2" : "",
              !canDownload ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={onDownloadClick}
            disabled={!canDownload}
          >
            <Download size={collapsed ? 24 : 18} />
            {!collapsed && <span className="ml-2">Download Video</span>}
          </Button>
          
          {!isAutoRotating ? (
            <Button
              variant="outline"
              className={cn(
                "w-full border-cyan-500/50 bg-purple-900/20 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleAutoRotate}
            >
              <RotateCcw size={collapsed ? 24 : 18} />
              {!collapsed && <span className="ml-2">Auto-Rotate</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full border-orange-500/50 bg-orange-900/20 text-orange-300 hover:bg-orange-900/30 hover:text-orange-100",
                collapsed ? "justify-center p-2" : ""
              )}
              onClick={onToggleAutoRotate}
            >
              <RotateCcw size={collapsed ? 24 : 18} />
              {!collapsed && <span className="ml-2">Stop Rotation</span>}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-purple-500/30">
        <a 
          href="https://threejs.org" 
          target="_blank" 
          rel="noopener" 
          className={cn(
            "text-xs text-cyan-400 hover:text-cyan-300 transition-colors", 
            collapsed ? "hidden" : "block"
          )}
        >
          powered by three.js
        </a>
      </div>
    </div>
  );
};

export default CyberpunkSidebar;
