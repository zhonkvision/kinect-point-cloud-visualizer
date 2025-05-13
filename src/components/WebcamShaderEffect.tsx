import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Define the shader code from ShaderToy
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D webcamTexture;
  uniform sampler2D fireTexture;
  uniform sampler2D timeTexture;
  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;

  #define STEP 4.

  // Sample pixel intensity
  float lookup(vec2 p) {
    vec4 c = texture2D(webcamTexture, p);
    return dot(c, c);
  }

  // Sobel filter implementation
  float sobel(vec2 p) {
    vec3 offset = vec3(STEP / resolution.x, 0.0, STEP / resolution.y); 
    float tl = lookup(p + vec2(-1.0,  1.0) * offset.xz);
    float cl = lookup(p + vec2(-1.0,  0.0) * offset.xy);
    float bl = lookup(p + vec2(-1.0, -1.0) * offset.xz);
    float ct = lookup(p + vec2( 0.0,  1.0) * offset.yz);
    float cb = lookup(p + vec2( 0.0, -1.0) * offset.yz);
    float tr = lookup(p + vec2( 1.0,  1.0) * offset.xz);
    float cr = lookup(p + vec2( 1.0,  0.0) * offset.xy);
    float br = lookup(p + vec2( 1.0, -1.0) * offset.xz);
    
    vec2 g = vec2(tl + 2.0 * cl + bl - tr - 2.0 * cr - br,
                 -tl - 2.0 * ct - tr + bl + 2.0 * cb + br);
    
    return dot(g, g);
  }

  void main() {
    float s = 1.0; // Default value for timeTexture effect
    
    // Apply the distortion effect similar to ShaderToy's mainImage
    vec2 uv = (1.0 - s * 0.015) * (vUv - 0.5) + 0.5;
    vec3 col = vec3(0.8, 0.2, 0.1) * sobel(uv);
    
    // Distortion
    uv += sin(30.0 * length(uv - 0.5) + time * 5.0) * (uv.yx - 0.5) * 0.01 / (15.0 * length(uv - 0.5) + 1.0);
    
    // Blending with texture (using fireTexture as iChannel0 from ShaderToy)
    vec3 fire = texture2D(fireTexture, uv).rgb;
    vec3 finalColor = mix(fire, col, 0.05);
    
    // Final output
    gl_FragColor = vec4(finalColor, s);
  }
`;

interface WebcamShaderEffectProps {
  webcamVideoRef: React.RefObject<HTMLVideoElement>;
}

const WebcamShaderEffect: React.FC<WebcamShaderEffectProps> = ({ webcamVideoRef }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const webcamTextureRef = useRef<THREE.VideoTexture | null>(null);
  
  // Create a noise texture for the fire effect
  useEffect(() => {
    if (!shaderRef.current) return;
    
    // Create fire texture (replacement for iChannel0)
    const fireTexture = createNoiseTexture();
    shaderRef.current.uniforms.fireTexture.value = fireTexture;
    
    // Create time texture (replacement for iChannel2)
    const timeTexture = createTimeTexture();
    shaderRef.current.uniforms.timeTexture.value = timeTexture;
    
    return () => {
      if (fireTexture) fireTexture.dispose();
      if (timeTexture) timeTexture.dispose();
      if (webcamTextureRef.current) webcamTextureRef.current.dispose();
    };
  }, []);

  // Update webcam texture when video changes
  useEffect(() => {
    if (!shaderRef.current || !webcamVideoRef.current) return;
    
    if (webcamTextureRef.current) {
      webcamTextureRef.current.dispose();
    }
    
    if (webcamVideoRef.current.readyState >= webcamVideoRef.current.HAVE_CURRENT_DATA) {
      const webcamTexture = new THREE.VideoTexture(webcamVideoRef.current);
      webcamTexture.minFilter = THREE.LinearFilter;
      webcamTexture.magFilter = THREE.LinearFilter;
      webcamTextureRef.current = webcamTexture;
      shaderRef.current.uniforms.webcamTexture.value = webcamTexture;
    }
  }, [webcamVideoRef.current?.readyState]);

  // Update shader uniforms on each frame
  useFrame((state) => {
    if (!shaderRef.current) return;
    
    // Update time uniform
    shaderRef.current.uniforms.time.value = state.clock.getElapsedTime();
    
    // Update webcam texture if video is playing
    if (webcamVideoRef.current && webcamVideoRef.current.readyState >= webcamVideoRef.current.HAVE_CURRENT_DATA) {
      if (!webcamTextureRef.current) {
        const webcamTexture = new THREE.VideoTexture(webcamVideoRef.current);
        webcamTexture.minFilter = THREE.LinearFilter;
        webcamTexture.magFilter = THREE.LinearFilter;
        webcamTextureRef.current = webcamTexture;
        shaderRef.current.uniforms.webcamTexture.value = webcamTexture;
      } else {
        webcamTextureRef.current.needsUpdate = true;
      }
    }
  });

  // Helper functions to create textures
  const createNoiseTexture = () => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    
    for (let i = 0; i < size * size * 4; i += 4) {
      const intensity = Math.floor(Math.random() * 255);
      data[i] = intensity;
      data[i + 1] = intensity;
      data[i + 2] = intensity;
      data[i + 3] = 255;
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  };

  const createTimeTexture = () => {
    // Simple 1x1 texture for time channel control
    const data = new Uint8Array([255, 255, 255, 255]);
    const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  };

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          webcamTexture: { value: null },
          fireTexture: { value: null },
          timeTexture: { value: null },
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(640, 480) }
        }}
      />
    </mesh>
  );
};

export default WebcamShaderEffect;
