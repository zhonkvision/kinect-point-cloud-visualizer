
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Upload, Download, FileVideo } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onVideoChange: (url: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoChange, canvasRef }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.includes('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an MP4 or WebM video file",
          variant: "destructive"
        });
        return;
      }

      setVideoFile(file);
      
      // Create object URL for the uploaded video
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      onVideoChange(objectUrl);
      
      // Reset recording state
      setRecordedChunks([]);

      toast({
        title: "Video uploaded",
        description: "Your video is now ready for processing",
      });
    }
  };

  const startCapture = () => {
    if (!canvasRef.current) {
      toast({
        title: "Error",
        description: "Canvas reference is not available",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    setIsProcessing(true);
    
    try {
      const stream = canvas.captureStream(30); // 30fps
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        setIsProcessing(false);
        toast({
          title: "Recording complete",
          description: "Your processed video is ready for download",
        });
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Processing your video...",
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Recording failed",
        description: "There was an error starting the recording",
        variant: "destructive"
      });
      console.error("Error starting recording:", error);
    }
  };

  const stopCapture = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length === 0) {
      toast({
        title: "No recording available",
        description: "Please record a processed video first",
        variant: "destructive"
      });
      return;
    }

    try {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kinect-processed-video.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your processed video is downloading",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the video",
        variant: "destructive"
      });
      console.error("Error downloading video:", error);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 bg-black/50 backdrop-blur-sm rounded-bl-lg z-10 flex flex-col gap-2">
      <div className="flex space-x-2">
        <Button variant="outline" onClick={triggerFileInput} className="flex items-center gap-2">
          <Upload size={18} />
          Upload Video
        </Button>
        <Input 
          type="file" 
          accept="video/mp4,video/webm" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {videoUrl && (
        <div className="flex space-x-2">
          {!isRecording ? (
            <Button 
              onClick={startCapture} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isProcessing}
            >
              <Video size={18} />
              Record Output
            </Button>
          ) : (
            <Button 
              onClick={stopCapture} 
              variant="destructive" 
              className="flex items-center gap-2"
            >
              <Video size={18} />
              Stop Recording
            </Button>
          )}

          {recordedChunks.length > 0 && (
            <Button 
              onClick={downloadVideo} 
              variant="secondary" 
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Download Video
            </Button>
          )}
        </div>
      )}

      {/* Hidden video element for debugging */}
      <video 
        ref={videoElementRef} 
        style={{ display: 'none' }} 
        controls 
        muted
      />
    </div>
  );
};

export default VideoUploader;
