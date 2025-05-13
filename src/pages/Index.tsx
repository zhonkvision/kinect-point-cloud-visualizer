import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import KinectVisualizer, { VisualizerControls } from '../components/KinectVisualizer';
import StarBackground from '../components/StarBackground';
import SpaceAmbience from '../components/SpaceAmbience';
import VideoUploader, { VideoUploaderHandle } from '../components/VideoUploader';
import WebcamInput from '../components/WebcamInput';
import CyberpunkSidebar from '../components/CyberpunkSidebar';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import * as THREE from 'three';

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoUploaderRef = useRef<VideoUploaderHandle>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const [defaultVideoActive, setDefaultVideoActive] = useState(true);
  const [useShaderEffect, setUseShaderEffect] = useState(true); // Default to shader effect for webcam
  const { toast } = useToast();
  
  // Visualizer controls state
  const [controls, setControls] = useState<VisualizerControls>({
    nearClipping: 850,
    farClipping: 4000,
    pointSize: 2,
    zOffset: 1000,
    opacity: 0.2,
    hueShift: 0,
    colorTint: new THREE.Color(1, 1, 1)
  });

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

  const handleCanvasCapture = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  };

  const handleTriggerFileUpload = () => {
    if (videoUploaderRef.current) {
      videoUploaderRef.current.triggerFileInput();
    }
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

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const handleToggleShaderEffect = () => {
    setUseShaderEffect(!useShaderEffect);
  };

  // Handle control parameter changes
  const handleControlChange = (controlName: string, value: number) => {
    setControls(prev => ({
      ...prev,
      [controlName]: value
    }));
  };

  // Handle controls update from visualizer
  const handleControlsUpdate = (newControls: VisualizerControls) => {
    setControls(newControls);
  };

  // Modified webcam toggle to include shader option
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

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Cyberpunk scanline effect */}
      <div className="scanline"></div>
      
      <Canvas
        camera={{ position: [0, 0, 500], fov: 50, near: 1, far: 10000 }}
        style={{ background: '#000000' }}
        className="w-full h-full absolute inset-0"
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          maxDistance={1000}
          minDistance={300}
        />
        <StarBackground />
        <KinectVisualizer 
          videoUrl={videoUrl} 
          captureCanvas={handleCanvasCapture} 
          useDefaultVideo={defaultVideoActive && !isWebcamActive}
          webcamVideoRef={isWebcamActive ? webcamVideoRef : undefined}
          useWebcamShader={isWebcamActive && useShaderEffect}
          controlValues={controls}
          onControlsUpdate={handleControlsUpdate}
        />
      </Canvas>
      
      <SpaceAmbience />
      
      <CyberpunkSidebar 
        onUploadClick={handleTriggerFileUpload}
        onRecordClick={handleStartRecording}
        onStopRecordClick={handleStopRecording}
        onDownloadClick={handleDownloadVideo}
        onToggleAutoRotate={handleToggleAutoRotate}
        onToggleWebcam={handleToggleWebcam}
        onToggleShaderEffect={handleToggleShaderEffect}
        onControlsChange={handleControlChange}
        isRecording={isRecording}
        isAutoRotating={autoRotate}
        isWebcamActive={isWebcamActive}
        useShaderEffect={useShaderEffect}
        canDownload={recordedChunks.length > 0}
        controls={controls}
      />
      
      <VideoUploader 
        ref={videoUploaderRef}
        onVideoChange={handleVideoChange} 
        canvasRef={canvasRef} 
      />

      {isWebcamActive && (
        <WebcamInput
          onWebcamStart={handleWebcamStart}
          onWebcamStop={handleWebcamStop}
        />
      )}
      
      <Toaster />
    </div>
  );
};

export default Index;
