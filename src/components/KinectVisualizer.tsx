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
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D( map, vUv );
    gl_FragColor = vec4( color.r, color.g, color.b, 0.2 );
  }
`;

const KinectVisualizer = () => {
  const pointsRef = useRef();
  const [uniforms] = useState({
    map: { value: null },
    width: { value: 640 },
    height: { value: 480 },
    nearClipping: { value: 850 },
    farClipping: { value: 4000 },
    pointSize: { value: 2 },
    zOffset: { value: 1000 }
  });

  useEffect(() => {
    const video = document.createElement('video');
    video.loop = true;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;

    video.src = 'https://bczcghpwiasggfmutqrd.supabase.co/storage/v1/object/public/pointcloudexp//ezgif.com-gif-to-mp4-converter%20(3)%20(24).mp4';

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    uniforms.map.value = texture;

    const gui = new GUI();
    gui.add(uniforms.nearClipping, 'value', 1, 10000, 1.0).name('nearClipping');
    gui.add(uniforms.farClipping, 'value', 1, 10000, 1.0).name('farClipping');
    gui.add(uniforms.pointSize, 'value', 1, 10, 1.0).name('pointSize');
    gui.add(uniforms.zOffset, 'value', 0, 4000, 1.0).name('zOffset');

    video.play();

    return () => {
      gui.destroy();
      video.pause();
    };
  }, [uniforms]);

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
