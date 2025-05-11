
import { Object3DNode } from '@react-three/fiber';
import { Points, ShaderMaterial } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: Object3DNode<Points, typeof Points>;
      bufferGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      bufferAttribute: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      shaderMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
      pointsMaterial: any;
      planeGeometry: any;
      mesh: any;
    }
  }
}
