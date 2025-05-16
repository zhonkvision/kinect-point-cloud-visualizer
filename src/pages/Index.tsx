
import { useState } from 'react';
import SpaceAmbience from '../components/SpaceAmbience';
import VideoUploader from '../components/VideoUploader';
import WebcamInput from '../components/WebcamInput';
import CyberpunkNav from '../components/CyberpunkNav';
import VisualizerScene from '../components/VisualizerScene';
import { Toaster } from "@/components/ui/toaster";
import { useVisualizerVideo } from '../hooks/useVisualizerVideo';
import { useCanvasRecorder } from '../hooks/useCanvasRecorder';
import { useVisualizerControls } from '../hooks/useVisualizerControls';

const Index = () => {
  // Use custom hooks for functionality
  const {
    videoState,
    videoUploaderRef,
    handleVideoChange,
    handleTriggerFileUpload,
    handleToggleWebcam,
    handleToggleShaderEffect,
    handleWebcamStart,
    handleWebcamStop,
  } = useVisualizerVideo();
  
  const {
    canvasRef,
    isRecording,
    recordedChunks,
    handleCanvasCapture,
    handleStartRecording,
    handleStopRecording,
    handleDownloadVideo
  } = useCanvasRecorder();
  
  const {
    autoRotate,
    navOpen,
    controls,
    handleToggleAutoRotate,
    handleToggleNav,
    handleControlChange,
    handleControlsUpdate
  } = useVisualizerControls();

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Cyberpunk scanline effect */}
      <div className="scanline"></div>
      
      <VisualizerScene
        videoState={videoState}
        autoRotate={autoRotate}
        controls={controls}
        onCanvasCapture={handleCanvasCapture}
        onControlsUpdate={handleControlsUpdate}
      />
      
      <SpaceAmbience />
      
      <CyberpunkNav
        isOpen={navOpen}
        onToggle={handleToggleNav}
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
        isWebcamActive={videoState.isWebcamActive}
        useShaderEffect={videoState.useShaderEffect}
        canDownload={recordedChunks.length > 0}
        controls={controls}
      />
      
      <VideoUploader 
        ref={videoUploaderRef}
        onVideoChange={handleVideoChange} 
        canvasRef={canvasRef} 
      />

      {videoState.isWebcamActive && (
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
