
import { useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders/KinectShaders';

interface PointCloudVisualizerProps {
  uniforms: {
    map: { value: THREE.Texture | null };
    width: { value: number };
    height: { value: number };
    nearClipping: { value: number };
    farClipping: { value: number };
    pointSize: { value: number };
    zOffset: { value: number };
    colorTint: { value: THREE.Color };
    opacity: { value: number };
    hueShift: { value: number };
  };
}

const PointCloudVisualizer = ({ uniforms }: PointCloudVisualizerProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const createVertices = () => {
    const width = uniforms.width.value;
    const height = uniforms.height.value;
    const vertices = new Float32Array(width * height * 3);
    
    for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
      vertices[i] = j % width;
      vertices[i + 1] = Math.floor(j / width);
    }
    
    return vertices;
  };

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={uniforms.width.value * uniforms.height.value}
          array={createVertices()}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        transparent={true}
      />
    </points>
  );
};

export default PointCloudVisualizer;
