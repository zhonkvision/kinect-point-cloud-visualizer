
import { Object3DNode } from '@react-three/fiber';
import { Points, ShaderMaterial } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: Object3DNode<Points, typeof Points>;
      bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
      bufferAttribute: {
        attach: string;
        count: number;
        array: Float32Array;
        itemSize: number;
      };
      shaderMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
      pointsMaterial: Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    }
  }
}
