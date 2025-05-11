
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
import KinectVisualizer from '../components/KinectVisualizer';
import StarBackground from '../components/StarBackground';
import SpaceAmbience from '../components/SpaceAmbience';
import VideoUploader, { VideoUploaderHandle } from '../components/VideoUploader';
import WebcamInput from '../components/WebcamInput';
import CyberpunkSidebar from '../components/CyberpunkSidebar';
import { Toaster } from "@/components/ui/toaster";
import VideoPlayerControls from '../components/VideoPlayerControls';
import MediaSourceManager from '../components/MediaSourceManager';
import SceneControls from '../components/SceneControls';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoUploaderRef = useRef<VideoUploaderHandle>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize our control hooks
  const videoControls = VideoPlayerControls({ canvasRef });
  const mediaManager = MediaSourceManager({ webcamVideoRef });
  const sceneControls = SceneControls();

  const handleCanvasCapture = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  };

  const handleTriggerFileUpload = () => {
    if (videoUploaderRef.current) {
      videoUploaderRef.current.triggerFileInput();
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
          autoRotate={sceneControls.autoRotate}
          autoRotateSpeed={1.5}
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          maxDistance={1000}
          minDistance={300}
        />
        <StarBackground />
        <KinectVisualizer 
          videoUrl={mediaManager.videoUrl} 
          captureCanvas={handleCanvasCapture} 
          useDefaultVideo={mediaManager.defaultVideoActive && !mediaManager.isWebcamActive}
          webcamVideoRef={mediaManager.isWebcamActive ? webcamVideoRef : undefined}
          useWebcamShader={mediaManager.isWebcamActive && mediaManager.useShaderEffect}
        />
      </Canvas>
      
      <SpaceAmbience />
      
      <CyberpunkSidebar 
        onUploadClick={handleTriggerFileUpload}
        onRecordClick={videoControls.handleStartRecording}
        onStopRecordClick={videoControls.handleStopRecording}
        onDownloadClick={videoControls.handleDownloadVideo}
        onToggleAutoRotate={sceneControls.handleToggleAutoRotate}
        onToggleWebcam={mediaManager.handleToggleWebcam}
        isRecording={videoControls.isRecording}
        isAutoRotating={sceneControls.autoRotate}
        isWebcamActive={mediaManager.isWebcamActive}
        canDownload={videoControls.canDownload}
      />
      
      {/* Add button to toggle between shader effects */}
      {mediaManager.isWebcamActive && (
        <button 
          onClick={mediaManager.handleToggleShaderEffect}
          className="absolute bottom-5 right-5 bg-purple-900/70 text-white p-2 rounded-md z-10 hover:bg-purple-800/70 text-xs font-mono border border-purple-500/40"
        >
          {mediaManager.useShaderEffect ? "USE KINECT EFFECT" : "USE SOBEL EFFECT"}
        </button>
      )}
      
      <VideoUploader 
        ref={videoUploaderRef}
        onVideoChange={mediaManager.handleVideoChange} 
        canvasRef={canvasRef} 
      />

      {mediaManager.isWebcamActive && (
        <WebcamInput
          onWebcamStart={mediaManager.handleWebcamStart}
          onWebcamStop={mediaManager.handleWebcamStop}
        />
      )}
      
      <Toaster />
    </div>
  );
};

export default Index;
