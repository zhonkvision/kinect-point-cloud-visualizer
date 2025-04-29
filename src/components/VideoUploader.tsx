
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Upload, Download } from 'lucide-react';

interface VideoUploaderProps {
  onVideoChange: (url: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoChange, canvasRef }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setVideoFile(file);
      
      // Create object URL for the uploaded video
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      onVideoChange(objectUrl);
      
      // Reset recording state
      setRecordedChunks([]);
    }
  };

  const startCapture = () => {
    if (!canvasRef.current) {
      console.error('Canvas reference is not available');
      return;
    }

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30); // 30fps
    
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopCapture = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kinect-processed-video.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
