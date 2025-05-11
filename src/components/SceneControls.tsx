
import { useState } from 'react';

const SceneControls = () => {
  const [autoRotate, setAutoRotate] = useState(false);
  
  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };
  
  return {
    autoRotate,
    handleToggleAutoRotate
  };
};

export default SceneControls;
