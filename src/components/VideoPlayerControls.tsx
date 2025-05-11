
import { useState, useRef } from 'react';
import { toast } from "@/hooks/use-toast";

interface VideoPlayerControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const VideoPlayerControls = ({ canvasRef }: VideoPlayerControlsProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = () => {
    if (!canvasRef.current) {
      return;
    }

    try {
      const stream = canvasRef.current.captureStream(30);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownloadVideo = () => {
    if (recordedChunks.length === 0) {
      return;
    }

    try {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zhonk-vision-processed.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  return {
    isRecording,
    canDownload: recordedChunks.length > 0,
    handleStartRecording,
    handleStopRecording,
    handleDownloadVideo
  };
};

export default VideoPlayerControls;
