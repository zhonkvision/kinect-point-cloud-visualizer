
import { useState, useEffect } from 'react';
import { VisualizerControls } from '../components/KinectVisualizer';
import * as THREE from 'three';

export function useVisualizerControls() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [mirrorView, setMirrorView] = useState(false);
  
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

  // Try to restore saved controls from localStorage
  useEffect(() => {
    try {
      const savedControls = localStorage.getItem('visualizer-controls');
      if (savedControls) {
        const parsedControls = JSON.parse(savedControls);
        // Recreate the THREE.Color object as it doesn't survive JSON serialization
        if (parsedControls.colorTint) {
          parsedControls.colorTint = new THREE.Color(
            parsedControls.colorTint.r, 
            parsedControls.colorTint.g, 
            parsedControls.colorTint.b
          );
        }
        setControls(parsedControls);
      }
      
      const savedAutoRotate = localStorage.getItem('visualizer-auto-rotate');
      if (savedAutoRotate) {
        setAutoRotate(savedAutoRotate === 'true');
      }
      
      const savedMirrorView = localStorage.getItem('visualizer-mirror-view');
      if (savedMirrorView) {
        setMirrorView(savedMirrorView === 'true');
      }

    } catch (error) {
      console.error('Error restoring saved controls:', error);
    }
  }, []);

  // Save controls to localStorage when they change
  useEffect(() => {
    try {
      const controlsToSave = {
        ...controls,
        // THREE.Color needs special handling for serialization
        colorTint: {
          r: controls.colorTint.r,
          g: controls.colorTint.g,
          b: controls.colorTint.b
        }
      };
      localStorage.setItem('visualizer-controls', JSON.stringify(controlsToSave));
    } catch (error) {
      console.error('Error saving controls:', error);
    }
  }, [controls]);

  // Save auto-rotate state
  useEffect(() => {
    localStorage.setItem('visualizer-auto-rotate', String(autoRotate));
  }, [autoRotate]);
  
  // Save mirror-view state
  useEffect(() => {
    localStorage.setItem('visualizer-mirror-view', String(mirrorView));
  }, [mirrorView]);

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };
  
  const handleToggleMirrorView = () => {
    setMirrorView(!mirrorView);
  };

  const handleToggleControls = () => {
    setControlsVisible(!controlsVisible);
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
    mirrorView,
    controlsVisible,
    controls,
    handleToggleAutoRotate,
    handleToggleMirrorView,
    handleToggleControls,
    handleControlChange,
    handleControlsUpdate
  };
}
