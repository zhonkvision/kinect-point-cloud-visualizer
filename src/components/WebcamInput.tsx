
import { useRef, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface WebcamInputProps {
  onWebcamStart: (videoElement: HTMLVideoElement) => void;
  onWebcamStop: () => void;
}

const WebcamInput: React.FC<WebcamInputProps> = ({ onWebcamStart, onWebcamStop }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startWebcam = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (!videoRef.current) {
        videoRef.current = document.createElement('video');
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
      }
      
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (!videoRef.current) return;
        
        const handleCanPlay = () => {
          videoRef.current?.removeEventListener('canplay', handleCanPlay);
          resolve();
        };
        
        videoRef.current.addEventListener('canplay', handleCanPlay);
      });
      
      await videoRef.current.play();
      setIsActive(true);
      
      // Pass the video element directly rather than trying to modify the ref
      if (videoRef.current) {
        onWebcamStart(videoRef.current);
      }
      
      toast({
        title: "Webcam started",
        description: "Webcam feed is now being processed with shader effects",
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast({
        variant: "destructive",
        title: "Webcam error",
        description: "Could not access webcam. Please check permissions.",
      });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsActive(false);
      onWebcamStop();
      
      toast({
        title: "Webcam stopped",
        description: "Webcam feed has been disconnected",
      });
    }
  };

  useEffect(() => {
    // Start webcam as soon as component mounts
    startWebcam();
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // No need to render the video element in the DOM
  return null;
};

export default WebcamInput;
