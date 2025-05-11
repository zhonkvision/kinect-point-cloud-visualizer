
import * as THREE from 'three';
import { Object3DNode } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: Object3DNode<THREE.Points, typeof THREE.Points>;
      bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
      bufferAttribute: {
        attach: string;
        count: number;
        array: Float32Array | Uint8Array;
        itemSize: number;
      };
      shaderMaterial: Object3DNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial>;
      pointsMaterial: Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    }
  }
}

export {};
