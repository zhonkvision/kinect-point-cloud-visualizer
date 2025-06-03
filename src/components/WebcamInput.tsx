
import { useRef, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { DraggablePanel } from "@/components/ui/draggable-panel";
import { Button } from "@/components/ui/button";
import { Camera, X, AlertTriangle, RefreshCw } from "lucide-react";

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
  const [isRetrying, setIsRetrying] = useState(false);

  const requestPermission = async () => {
    setPermissionRequested(true);
    setShowPermissionPrompt(false);
    setIsRetrying(true);
    await startWebcam();
    setIsRetrying(false);
  };

  const dismissPermissionPrompt = () => {
    setShowPermissionPrompt(false);
    onWebcamStop(); // Stop webcam process since permission was denied
  };

  const retryWebcam = async () => {
    setPermissionDenied(false);
    setShowPermissionPrompt(true);
    setPermissionRequested(false);
  };

  const startWebcam = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser doesn't support camera access");
      }

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Prefer front camera
        },
        audio: false // Explicitly disable audio
      };

      console.log('Requesting webcam access...');
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
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject(new Error("Video element not available"));
        
        const handleCanPlay = () => {
          videoRef.current?.removeEventListener('canplay', handleCanPlay);
          videoRef.current?.removeEventListener('error', handleError);
          resolve();
        };

        const handleError = (e: Event) => {
          videoRef.current?.removeEventListener('canplay', handleCanPlay);
          videoRef.current?.removeEventListener('error', handleError);
          reject(new Error("Video failed to load"));
        };
        
        videoRef.current.addEventListener('canplay', handleCanPlay);
        videoRef.current.addEventListener('error', handleError);
      });
      
      await videoRef.current.play();
      setIsActive(true);
      setPermissionDenied(false);
      onWebcamStart(videoRef.current);
      
      toast({
        title: "Webcam started",
        description: "Camera feed is now active and ready for visualization",
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      
      setPermissionDenied(true);
      setShowPermissionPrompt(true);
      
      let errorMessage = "Could not access webcam. Please check permissions.";
      let errorTitle = "Webcam error";
      
      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.message.includes("Permission denied")) {
          errorTitle = "Permission denied";
          errorMessage = "Camera access was denied. Please allow camera access and try again.";
        } else if (error.name === "NotFoundError") {
          errorTitle = "No camera found";
          errorMessage = "No camera device was found. Please connect a camera and try again.";
        } else if (error.name === "NotReadableError") {
          errorTitle = "Camera in use";
          errorMessage = "Camera is already in use by another application. Please close other apps and try again.";
        } else if (error.name === "OverconstrainedError") {
          errorTitle = "Camera constraints error";
          errorMessage = "Camera doesn't support the requested settings. Trying with default settings.";
        }
      }
      
      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
      
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
        description: "Camera feed has been disconnected",
      });
    }
  };

  useEffect(() => {
    // Check permission status on mount
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          console.log('Camera permission status:', permissionStatus.state);
          
          if (permissionStatus.state === 'granted') {
            setPermissionRequested(true);
            setShowPermissionPrompt(false);
            startWebcam();
          } else if (permissionStatus.state === 'denied') {
            setPermissionDenied(true);
            setShowPermissionPrompt(true);
          }
          // If prompt, we show the permission request UI
        })
        .catch((err) => {
          console.log('Could not query camera permissions:', err);
          // If we can't query permissions, we'll show the prompt anyway
        });
    }
      
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Don't show UI if webcam is already active
  if (isActive) {
    return null;
  }

  // Don't show UI if user dismissed and we're not retrying
  if (!showPermissionPrompt && !permissionDenied) {
    return null;
  }

  return (
    <DraggablePanel
      id="webcam-permission"
      title="CAMERA ACCESS"
      icon={<Camera size={16} className="text-cyan-500" />}
      defaultPosition={{ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 }}
      defaultSize={{ width: 320, height: "auto" }}
      onClose={dismissPermissionPrompt}
    >
      <div className="space-y-4">
        {permissionDenied ? (
          <>
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded">
              <AlertTriangle size={16} className="text-red-400" />
              <div>
                <p className="text-sm text-red-300 font-semibold">Camera Access Required</p>
                <p className="text-xs text-red-400">
                  ZHONK VISION needs camera permissions to create visualizations.
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-cyan-300">
              <p><strong>To enable camera access:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Select "Allow" for camera permissions</li>
                <li>Refresh the page and try again</li>
              </ol>
            </div>
          </>
        ) : (
          <p className="text-sm text-cyan-300">
            ZHONK VISION needs permission to use your camera for real-time visualization effects.
          </p>
        )}
        
        <div className="flex flex-col gap-2">
          {permissionDenied ? (
            <Button
              variant="outline"
              className="w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100"
              onClick={retryWebcam}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <RefreshCw size={16} className="mr-2 animate-spin" />
              ) : (
                <Camera size={16} className="mr-2" />
              )}
              Try Again
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full border-cyan-500/30 bg-black/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100"
              onClick={requestPermission}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <RefreshCw size={16} className="mr-2 animate-spin" />
              ) : (
                <Camera size={16} className="mr-2" />
              )}
              Grant Camera Access
            </Button>
          )}
          
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
