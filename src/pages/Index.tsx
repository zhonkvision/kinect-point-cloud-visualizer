import { useState, useEffect } from 'react';
import SpaceAmbience from '../components/SpaceAmbience';
import VideoUploader from '../components/VideoUploader';
import WebcamInput from '../components/WebcamInput';
import VisualizerScene from '../components/VisualizerScene';
import { Toaster } from "@/components/ui/toaster";
import { useVisualizerVideo } from '../hooks/useVisualizerVideo';
import { useCanvasRecorder } from '../hooks/useCanvasRecorder';
import { useVisualizerControls } from '../hooks/useVisualizerControls';
import InputOutputControls from '../components/InputOutputControls';
import CameraControls from '../components/CameraControls';
import VisualizationControls from '../components/VisualizationControls';
import ControlToggler from '../components/ControlToggler';
import { useToast } from '@/components/ui/use-toast';
import ShaderMirrorControls from '../components/ShaderMirrorControls';

const Index = () => {
  const { toast } = useToast();
  
  // Use custom hooks for functionality
  const {
    videoState,
    mirrorView,
    videoUploaderRef,
    handleVideoChange,
    handleTriggerFileUpload,
    handleToggleWebcam,
    handleToggleShaderEffect,
    handleToggleMirrorView,
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
    controlsVisible,
    controls,
    handleToggleAutoRotate,
    handleToggleControls,
    handleControlChange,
    handleControlsUpdate
  } = useVisualizerControls();

  // Show welcome toast when the page loads
  useEffect(() => {
    toast({
      title: "Welcome to ZHONK VISION",
      description: "Drag panels to reposition them. Click the menu icon to show/hide panels.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Cyberpunk scanline effect */}
      <div className="scanline"></div>
      
      <VisualizerScene
        videoState={videoState}
        autoRotate={autoRotate}
        controls={controls}
        mirrorView={mirrorView}
        onCanvasCapture={handleCanvasCapture}
        onControlsUpdate={handleControlsUpdate}
      />
      
      <SpaceAmbience />

      {/* Draggable Control Panels */}
      <InputOutputControls
        onUploadClick={handleTriggerFileUpload}
        onRecordClick={handleStartRecording}
        onStopRecordClick={handleStopRecording}
        onDownloadClick={handleDownloadVideo}
        onToggleWebcam={handleToggleWebcam}
        isRecording={isRecording}
        isWebcamActive={videoState.isWebcamActive}
        canDownload={recordedChunks.length > 0}
        visible={controlsVisible}
      />
      
      <CameraControls
        onToggleAutoRotate={handleToggleAutoRotate}
        isAutoRotating={autoRotate}
        visible={controlsVisible}
      />

      <ShaderMirrorControls
        onToggleShaderEffect={handleToggleShaderEffect}
        onToggleMirrorView={handleToggleMirrorView}
        useShaderEffect={videoState.useShaderEffect}
        isMirroredView={mirrorView}
        visible={controlsVisible}
        isVideoActive={videoState.isWebcamActive || !!videoState.videoUrl}
      />
      
      <VisualizationControls
        controls={controls}
        onControlsChange={handleControlChange}
        visible={controlsVisible}
      />

      {/* Control Toggle Button */}
      <ControlToggler 
        isOpen={controlsVisible} 
        onClick={handleToggleControls} 
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
