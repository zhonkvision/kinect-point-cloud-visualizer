import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import WebcamShaderEffect from './WebcamShaderEffect';
import KinectControls from './KinectControls';
import PointCloudVisualizer from './PointCloudVisualizer';
import VideoTextureManager from './VideoTextureManager';

interface KinectVisualizerProps {
  videoUrl?: string;
  captureCanvas?: (canvas: HTMLCanvasElement | null) => void;
  useDefaultVideo?: boolean;
  webcamVideoRef?: React.RefObject<HTMLVideoElement>;
  useWebcamShader?: boolean;
}

const KinectVisualizer = ({ 
  videoUrl, 
  captureCanvas, 
  useDefaultVideo = true, 
  webcamVideoRef,
  useWebcamShader = false
}: KinectVisualizerProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  const [uniforms] = useState({
    map: { value: null },
    width: { value: 640 },
    height: { value: 480 },
    nearClipping: { value: 850 },
    farClipping: { value: 4000 },
    pointSize: { value: 2 },
    zOffset: { value: 1000 },
    colorTint: { value: new THREE.Color(1, 1, 1) },
    opacity: { value: 0.2 },
    hueShift: { value: 0 }
  });

  // Handle texture updates when loaded
  const handleTextureLoaded = (texture: THREE.VideoTexture) => {
    uniforms.map.value = texture;
  };

  // Pass the WebGL canvas to the parent component for video capture
  useFrame((state) => {
    if (captureCanvas && state.gl.domElement && !rendererRef.current) {
      rendererRef.current = state.gl;
      captureCanvas(state.gl.domElement);
    }
  });

  // If we're using the webcam with the shader effect
  if (useWebcamShader && webcamVideoRef) {
    return <WebcamShaderEffect webcamVideoRef={webcamVideoRef} />;
  }

  // Otherwise use the original Kinect point cloud effect
  return (
    <>
      {/* Only show controls when not using webcam shader */}
      {!useWebcamShader && (
        <KinectControls uniforms={uniforms} />
      )}
      
      {/* Handle video texture loading */}
      {!useWebcamShader && (
        <VideoTextureManager 
          videoUrl={videoUrl}
          useDefaultVideo={useDefaultVideo}
          onTextureLoaded={handleTextureLoaded}
        />
      )}
      
      {/* Render the point cloud visualization */}
      <PointCloudVisualizer uniforms={uniforms} />
    </>
  );
};

export default KinectVisualizer;
