
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import KinectVisualizer from '../components/KinectVisualizer';
import StarBackground from '../components/StarBackground';
import SpaceAmbience from '../components/SpaceAmbience';

const Index = () => {
  return (
    <div className="w-full h-screen">
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
        <KinectVisualizer />
      </Canvas>
      <SpaceAmbience />
      <div className="fixed top-0 left-0 p-4 text-white text-sm">
        <a href="https://threejs.org" target="_blank" rel="noopener" className="hover:text-blue-400">
          three.js
        </a>
        {' - kinect'}
      </div>
    </div>
  );
};

export default Index;
