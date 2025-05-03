
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
import KinectVisualizer from '../components/KinectVisualizer';
import StarBackground from '../components/StarBackground';
import SpaceAmbience from '../components/SpaceAmbience';
import VideoUploader, { VideoUploaderHandle } from '../components/VideoUploader';
import CyberpunkSidebar from '../components/CyberpunkSidebar';
import AsciiTitle from '../components/AsciiTitle';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoUploaderRef = useRef<VideoUploaderHandle>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  const handleVideoChange = (url: string) => {
    setVideoUrl(url);
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

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
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
        <KinectVisualizer videoUrl={videoUrl} captureCanvas={handleCanvasCapture} />
      </Canvas>
      
      <SpaceAmbience />
      
      <AsciiTitle />
      
      <CyberpunkSidebar 
        onUploadClick={handleTriggerFileUpload}
        onRecordClick={handleStartRecording}
        onStopRecordClick={handleStopRecording}
        onDownloadClick={handleDownloadVideo}
        onToggleAutoRotate={handleToggleAutoRotate}
        isRecording={isRecording}
        isAutoRotating={autoRotate}
        canDownload={recordedChunks.length > 0}
      />
      
      <VideoUploader 
        ref={videoUploaderRef}
        onVideoChange={handleVideoChange} 
        canvasRef={canvasRef} 
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
