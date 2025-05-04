
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
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
        onWebcamStart(videoRef.current);
        toast({
          title: "Webcam started",
          description: "Webcam feed is now being processed with Kinect effect",
        });
      }
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
      setIsActive(false);
      onWebcamStop();
      toast({
        title: "Webcam stopped",
        description: "Webcam feed has been disconnected",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      className="hidden"
      playsInline
      muted
    />
  );
};

export default WebcamInput;
