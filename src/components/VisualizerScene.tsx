
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import KinectVisualizer from './KinectVisualizer';
import StarBackground from './StarBackground';
import { VideoState } from '../hooks/useVisualizerVideo';
import { VisualizerControls } from './KinectVisualizer';

interface VisualizerSceneProps {
  videoState: VideoState;
  autoRotate: boolean;
  controls: VisualizerControls;
  onCanvasCapture: (canvas: HTMLCanvasElement | null) => void;
  onControlsUpdate: (controls: VisualizerControls) => void;
}

const VisualizerScene = ({
  videoState,
  autoRotate,
  controls,
  onCanvasCapture,
  onControlsUpdate
}: VisualizerSceneProps) => {
  const { videoUrl, defaultVideoActive, isWebcamActive, webcamVideoRef, useShaderEffect } = videoState;

  return (
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
        captureCanvas={onCanvasCapture} 
        useDefaultVideo={defaultVideoActive && !isWebcamActive}
        webcamVideoRef={isWebcamActive ? webcamVideoRef : undefined}
        useWebcamShader={isWebcamActive && useShaderEffect}
        controlValues={controls}
        onControlsUpdate={onControlsUpdate}
      />
    </Canvas>
  );
};

export default VisualizerScene;
