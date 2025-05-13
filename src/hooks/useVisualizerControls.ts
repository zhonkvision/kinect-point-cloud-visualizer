
import { useState } from 'react';
import { VisualizerControls } from '../components/KinectVisualizer';
import * as THREE from 'three';

export function useVisualizerControls() {
  const [autoRotate, setAutoRotate] = useState(false);
  
  // Visualizer controls state
  const [controls, setControls] = useState<VisualizerControls>({
    nearClipping: 850,
    farClipping: 4000,
    pointSize: 2,
    zOffset: 1000,
    opacity: 0.2,
    hueShift: 0,
    colorTint: new THREE.Color(1, 1, 1)
  });

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  // Handle control parameter changes
  const handleControlChange = (controlName: string, value: number) => {
    setControls(prev => ({
      ...prev,
      [controlName]: value
    }));
  };

  // Handle controls update from visualizer
  const handleControlsUpdate = (newControls: VisualizerControls) => {
    setControls(newControls);
  };

  return {
    autoRotate,
    controls,
    handleToggleAutoRotate,
    handleControlChange,
    handleControlsUpdate
  };
}
