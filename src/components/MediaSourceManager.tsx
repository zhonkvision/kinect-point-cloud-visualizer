import { useState, useEffect, useRef } from 'react';

interface MediaSourceManagerProps {
  webcamVideoRef: React.RefObject<HTMLVideoElement | null>;
}

const MediaSourceManager = ({ webcamVideoRef }: MediaSourceManagerProps) => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [defaultVideoActive, setDefaultVideoActive] = useState(true);
  const [useShaderEffect, setUseShaderEffect] = useState(true);

  // Clear previous media if switching sources
  useEffect(() => {
    if (isWebcamActive && videoUrl && defaultVideoActive) {
      // If switching to webcam and a video URL exists, revoke it if it's a blob URL
      if (videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
      setDefaultVideoActive(false);
    }
  }, [isWebcamActive, videoUrl, defaultVideoActive]);

  const handleVideoChange = (url: string) => {
    // If webcam is active, stop it first
    if (isWebcamActive) {
      setIsWebcamActive(false);
    }
    
    // Clear previous URL if it was a blob
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    
    setVideoUrl(url);
    setDefaultVideoActive(true);
  };

  const handleToggleWebcam = () => {
    if (isWebcamActive) {
      // If webcam is active, stopping it will revert to default video
      setIsWebcamActive(false);
      setDefaultVideoActive(true);
      
      // Set to undefined to trigger default video loading in KinectVisualizer
      setVideoUrl(undefined);
    } else {
      // Otherwise, activate webcam
      setDefaultVideoActive(false);
      setIsWebcamActive(true);
    }
  };

  const handleToggleShaderEffect = () => {
    setUseShaderEffect(!useShaderEffect);
  };

  // Function to handle webcam start
  const handleWebcamStart = (videoElement: HTMLVideoElement) => {
    webcamVideoRef.current = videoElement;
    
    // If not using shader effect, process video frames as before
    if (!useShaderEffect) {
      // Create a video processor for the webcam feed
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      // Process video frames
      const videoProcessor = () => {
        if (ctx && videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          
          // Create a blob URL only once
          if (!videoUrl) {
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
              }
            }, 'image/jpeg', 0.8);
          }
        }
        
        // Continue processing frames while webcam is active
        if (isWebcamActive && !useShaderEffect) {
          requestAnimationFrame(videoProcessor);
        }
      };
      
      videoProcessor();
    }
  };

  const handleWebcamStop = () => {
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(undefined);
    setDefaultVideoActive(true);
  };

  return {
    videoUrl,
    isWebcamActive,
    defaultVideoActive,
    useShaderEffect,
    handleVideoChange,
    handleToggleWebcam,
    handleToggleShaderEffect,
    handleWebcamStart,
    handleWebcamStop
  };
};

export default MediaSourceManager;
