
import { useEffect } from 'react';
import { GUI } from 'lil-gui';
import * as THREE from 'three';

interface KinectControlsProps {
  uniforms: {
    nearClipping: { value: number };
    farClipping: { value: number };
    pointSize: { value: number };
    zOffset: { value: number };
    opacity: { value: number };
    hueShift: { value: number };
    colorTint: { value: THREE.Color };
  };
}

const KinectControls = ({ uniforms }: KinectControlsProps) => {
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

  return null;
};

export default KinectControls;
