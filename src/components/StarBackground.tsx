
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const StarBackground = () => {
  const starsRef = useRef<THREE.Points>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array>(new Uint8Array(128));

  // Create star particles
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    return [positions, colors];
  }, []);

  // Animate stars based on audio
  useFrame((state) => {
    if (starsRef.current) {
      if (!analyserRef.current) {
        const audioContext = (window as any).globalAudioContext;
        if (audioContext) {
          analyserRef.current = audioContext.createAnalyser();
          analyserRef.current.fftSize = 256;
          const source = audioContext.createMediaElementSource(audioContext.createGain());
          source.connect(analyserRef.current);
          analyserRef.current.connect(audioContext.destination);
        }
      }

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(audioDataRef.current);
        const averageFrequency = audioDataRef.current.reduce((acc, val) => acc + val, 0) / audioDataRef.current.length;
        
        // Modify star rotation based on audio intensity
        starsRef.current.rotation.x += 0.0001 * (1 + averageFrequency / 128);
        starsRef.current.rotation.y += 0.0001 * (1 + averageFrequency / 128);
        
        // Scale stars based on audio
        const scale = 1 + (averageFrequency / 512);
        starsRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={5000}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={5000}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default StarBackground;
