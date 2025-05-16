
import { useRef, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { DraggablePanel } from "@/components/ui/draggable-panel";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface WebcamInputProps {
  onWebcamStart: (videoElement: HTMLVideoElement) => void;
  onWebcamStop: () => void;
}

const WebcamInput: React.FC<WebcamInputProps> = ({ onWebcamStart, onWebcamStop }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);

  const requestPermission = async () => {
    setPermissionRequested(true);
    setShowPermissionPrompt(false);
    await startWebcam();
  };

  const dismissPermissionPrompt = () => {
    setShowPermissionPrompt(false);
    onWebcamStop(); // Stop webcam process since permission was denied
  };

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
      onWebcamStart(videoRef.current);
      
      toast({
        title: "Webcam started",
        description: "Webcam feed is now being processed with shader effects",
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      
      setPermissionDenied(true);
      
      // Check if it's a permission error
      if ((error as DOMException).name === "NotAllowedError") {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "Camera access was denied. Please allow camera access in your browser settings.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Webcam error",
          description: "Could not access webcam. Please check permissions or try another device.",
        });
      }
      
      onWebcamStop(); // Notify the parent that webcam couldn't be started
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
    // Check permission status on mount
    navigator.permissions.query({ name: 'camera' as PermissionName })
      .then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          setPermissionRequested(true);
          setShowPermissionPrompt(false);
          startWebcam();
        } else if (permissionStatus.state === 'denied') {
          setPermissionDenied(true);
          setShowPermissionPrompt(false);
          onWebcamStop(); // Notify parent that webcam can't be used
        }
      })
      .catch(() => {
        // If we can't query permissions, we'll show the prompt anyway
      });
      
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!showPermissionPrompt) {
    return null; // No UI shown after permission handled
  }

  return (
    <DraggablePanel
      id="webcam-permission"
      title="CAMERA ACCESS"
      icon={<Camera size={16} className="text-cyan-500" />}
      defaultPosition={{ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 }}
      defaultSize={{ width: 300, height: "auto" }}
      onClose={dismissPermissionPrompt}
    >
      <div className="space-y-4">
        <p className="text-sm text-cyan-300">
          ZHONK VISION needs permission to use your camera for real-time visualization.
        </p>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100"
            onClick={requestPermission}
          >
            <Camera size={16} className="mr-2" />
            Grant Camera Access
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-red-500/30 bg-black/50 text-red-300 hover:bg-red-900/30 hover:text-red-100"
            onClick={dismissPermissionPrompt}
          >
            <X size={16} className="mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default WebcamInput;
