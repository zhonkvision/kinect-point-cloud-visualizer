import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const StarBackground = () => {
  const starsRef = useRef<THREE.Points>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array>(new Uint8Array(128));

  // Create star particles with a much larger spread
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(10000 * 3); // Increased number of stars
    const colors = new Float32Array(10000 * 3);
    
    for (let i = 0; i < 10000; i++) {
      // Spread stars across a much larger space
      positions[i * 3] = (Math.random() - 0.5) * 4000;     // Wider X spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4000; // Wider Y spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4000; // Wider Z spread

      // Create more varied star colors with a bias towards white/blue
      const blueWhiteBias = Math.random() * 0.3; // Add blue-white bias
      colors[i * 3] = 0.8 + blueWhiteBias;     // Red (biased towards bright)
      colors[i * 3 + 1] = 0.8 + blueWhiteBias; // Green (biased towards bright)
      colors[i * 3 + 2] = 0.9 + blueWhiteBias; // Blue (slightly stronger)
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
        
        // Create a more dynamic movement pattern
        starsRef.current.rotation.x += 0.0001 * (1 + averageFrequency / 256);
        starsRef.current.rotation.y += 0.0001 * (1 + averageFrequency / 256);
        
        // Pulse the stars based on audio
        const scale = 1 + (averageFrequency / 1024);
        starsRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={10000}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={10000}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default StarBackground;
