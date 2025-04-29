
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
import KinectVisualizer from '../components/KinectVisualizer';
import StarBackground from '../components/StarBackground';
import SpaceAmbience from '../components/SpaceAmbience';
import VideoUploader from '../components/VideoUploader';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleVideoChange = (url: string) => {
    setVideoUrl(url);
  };

  const handleCanvasCapture = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  };

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 500], fov: 50, near: 1, far: 10000 }}
        style={{ background: '#000000' }}
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
      <VideoUploader onVideoChange={handleVideoChange} canvasRef={canvasRef} />
      <div className="fixed top-0 left-0 p-4 text-white text-sm">
        <a href="https://threejs.org" target="_blank" rel="noopener" className="hover:text-blue-400">
          three.js
        </a>
        {' - kinect visualizer'}
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
