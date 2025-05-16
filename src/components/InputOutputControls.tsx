
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Video, Download, Webcam } from "lucide-react";
import { DraggablePanel } from "@/components/ui/draggable-panel";

interface InputOutputControlsProps {
  onUploadClick: () => void;
  onRecordClick: () => void;
  onStopRecordClick: () => void;
  onDownloadClick: () => void;
  onToggleWebcam: () => void;
  isRecording: boolean;
  isWebcamActive: boolean;
  canDownload: boolean;
  visible: boolean;
}

const InputOutputControls: React.FC<InputOutputControlsProps> = ({
  onUploadClick,
  onRecordClick,
  onStopRecordClick,
  onDownloadClick,
  onToggleWebcam,
  isRecording,
  isWebcamActive,
  canDownload,
  visible,
}) => {
  if (!visible) return null;

  return (
    <DraggablePanel
      id="input-output-controls"
      title="INPUT/OUTPUT"
      icon={<Video size={16} className="text-cyan-500" />}
      defaultPosition={{ x: 20, y: 20 }}
      defaultSize={{ width: 300, height: "auto" }}
    >
      <div className="space-y-3">
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
          className={`w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100 transition-all duration-200 ${
            !canDownload && "opacity-50 cursor-not-allowed"
          }`}
          onClick={onDownloadClick}
          disabled={!canDownload}
        >
          <Download size={16} className="mr-2" />
          Download Video
        </Button>
      </div>
    </DraggablePanel>
  );
};

export default InputOutputControls;
