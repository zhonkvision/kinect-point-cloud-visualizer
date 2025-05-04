
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GUI } from 'lil-gui';

const vertexShader = `
  uniform sampler2D map;
  uniform float width;
  uniform float height;
  uniform float nearClipping, farClipping;
  uniform float pointSize;
  uniform float zOffset;
  varying vec2 vUv;
  const float XtoZ = 1.11146;
  const float YtoZ = 0.83359;

  void main() {
    vUv = vec2( position.x / width, position.y / height );
    vec4 color = texture2D( map, vUv );
    float depth = ( color.r + color.g + color.b ) / 3.0;
    float z = ( 1.0 - depth ) * (farClipping - nearClipping) + nearClipping;
    vec4 pos = vec4(
      ( position.x / width - 0.5 ) * z * XtoZ,
      ( position.y / height - 0.5 ) * z * YtoZ,
      - z + zOffset,
      1.0);
    gl_PointSize = pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
  }
`;

const fragmentShader = `
  uniform sampler2D map;
  uniform vec3 colorTint;
  uniform float opacity;
  uniform float hueShift;
  varying vec2 vUv;

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec4 color = texture2D(map, vUv);
    vec3 hsv = rgb2hsv(color.rgb);
    hsv.x = fract(hsv.x + hueShift); // Shift hue
    vec3 tintedColor = hsv2rgb(hsv) * colorTint;
    gl_FragColor = vec4(tintedColor, opacity);
  }
`;

interface KinectVisualizerProps {
  videoUrl?: string;
  captureCanvas?: (canvas: HTMLCanvasElement | null) => void;
}

const KinectVisualizer = ({ videoUrl, captureCanvas }: KinectVisualizerProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
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

  // Create a GUI panel for adjusting effects
  useEffect(() => {
    const gui = new GUI();
    gui.add(uniforms.nearClipping, 'value', 1, 10000, 1.0).name('nearClipping');
    gui.add(uniforms.farClipping, 'value', 1, 10000, 1.0).name('farClipping');
    gui.add(uniforms.pointSize, 'value', 1, 10, 1.0).name('pointSize');
    gui.add(uniforms.zOffset, 'value', 0, 4000, 1.0).name('zOffset');
    gui.add(uniforms.opacity, 'value', 0, 1, 0.01).name('opacity');
    gui.add(uniforms.hueShift, 'value', 0, 1, 0.01).name('hueShift');
    gui.addColor({ color: '#ffffff' }, 'color')
      .onChange(value => {
        uniforms.colorTint.value.setStyle(value);
      });

    return () => {
      gui.destroy();
    };
  }, [uniforms]);

  // Handle video source changes
  useEffect(() => {
    if (textureRef.current) {
      textureRef.current.dispose();
      textureRef.current = null;
    }
    
    // Create or update video element
    if (!videoRef.current) {
      const video = document.createElement('video');
      video.loop = true;
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.playsInline = true;
      videoRef.current = video;
    }
    
    if (videoUrl) {
      const video = videoRef.current;
      video.src = videoUrl;
      video.load();
      
      // Create new texture with this video
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      textureRef.current = texture;
      uniforms.map.value = texture;
      
      video.play().catch(err => {
        console.error("Error playing video:", err);
      });
    } else {
      // Default video if none provided
      const video = videoRef.current;
      video.src = 'https://bczcghpwiasggfmutqrd.supabase.co/storage/v1/object/public/pointcloudexp//AD_00002.mp4';
      video.load();
      
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      textureRef.current = texture;
      uniforms.map.value = texture;
      
      video.play().catch(err => {
        console.error("Error playing default video:", err);
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [videoUrl, uniforms.map]);

  // Pass the WebGL canvas to the parent component for video capture
  useFrame((state) => {
    if (captureCanvas && state.gl.domElement && !rendererRef.current) {
      rendererRef.current = state.gl;
      captureCanvas(state.gl.domElement);
    }
    
    // For webcam input, we need to ensure texture updates every frame
    if (textureRef.current && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      textureRef.current.needsUpdate = true;
    }
  });

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

export default KinectVisualizer;
