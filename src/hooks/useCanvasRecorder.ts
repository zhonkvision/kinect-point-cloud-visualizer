
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function useCanvasRecorder() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const handleCanvasCapture = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  };

  const handleStartRecording = () => {
    if (!canvasRef.current) {
      toast({
        title: "Recording Error",
        description: "Cannot start recording, canvas not initialized",
        variant: "destructive"
      });
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
        toast({
          title: "Recording Complete",
          description: "Your video is ready to download",
        });
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Capturing your visualization"
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownloadVideo = () => {
    if (recordedChunks.length === 0) {
      toast({
        title: "Download Error",
        description: "No recorded video available to download",
        variant: "destructive"
      });
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
      toast({
        title: "Download Started",
        description: "Your video is being downloaded"
      });
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({
        title: "Download Error",
        description: "Failed to download video",
        variant: "destructive"
      });
    }
  };

  return {
    canvasRef,
    isRecording,
    recordedChunks,
    handleCanvasCapture,
    handleStartRecording,
    handleStopRecording,
    handleDownloadVideo
  };
}
