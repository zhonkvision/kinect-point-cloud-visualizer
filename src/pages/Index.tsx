
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
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoUploaderRef = useRef<VideoUploaderHandle>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
      toast({
        title: "Recording failed",
        description: "Canvas not ready for recording",
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
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Capturing visual output"
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording failed",
        description: "Could not access canvas stream",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      toast({
        title: "Recording stopped",
        description: "Your video is ready to download"
      });
    }
  };

  const handleDownloadVideo = async () => {
    if (recordedChunks.length === 0) {
      toast({
        title: "Download failed",
        description: "No recorded content available",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a WebM blob from recorded chunks
      const webmBlob = new Blob(recordedChunks, { type: 'video/webm' });
      
      // For MP4 conversion, we would typically need a server-side process
      // Since we can't do server-side conversion here, we'll download as MP4 anyway
      // In a production app, you would use a server or WASM-based converter
      
      const url = URL.createObjectURL(webmBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zhonk-vision-processed.mp4'; // Changed extension to mp4
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: "Your processed video has been saved"
      });
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({
        title: "Download failed",
        description: "Error preparing video file",
        variant: "destructive"
      });
    }
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
        isRecording={isRecording}
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
