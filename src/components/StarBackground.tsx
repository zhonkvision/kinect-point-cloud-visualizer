
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const StarBackground = () => {
  const starsRef = useRef<THREE.Points>(null);

  // Create star particles
  const particlesCount = 5000;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;     // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z
  }

  // Animate stars
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001;
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        color={0xffffff}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
};

export default StarBackground;
