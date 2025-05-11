
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface VideoTextureManagerProps {
  videoUrl?: string;
  useDefaultVideo: boolean;
  onTextureLoaded: (texture: THREE.VideoTexture) => void;
}

const VideoTextureManager = ({ 
  videoUrl, 
  useDefaultVideo, 
  onTextureLoaded 
}: VideoTextureManagerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const defaultVideoURL = 'https://bczcghpwiasggfmutqrd.supabase.co/storage/v1/object/public/pointcloudexp//AD_00002.mp4';
  
  // Create or get video element when needed
  const getOrCreateVideoElement = () => {
    if (!videoRef.current) {
      const video = document.createElement('video');
      video.loop = true;
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.playsInline = true;
      videoRef.current = video;
    }
    return videoRef.current;
  };

  // Handle video source changes
  useEffect(() => {
    // First cleanup any existing video texture
    if (textureRef.current) {
      textureRef.current.dispose();
      textureRef.current = null;
    }
    
    // Clean up current video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    
    // Get or create video element
    const video = getOrCreateVideoElement();
    
    // Determine which video source to use
    const sourceUrl = videoUrl || (useDefaultVideo ? defaultVideoURL : null);
    
    if (sourceUrl) {
      // Set video source
      video.src = sourceUrl;
      video.load();
      
      // Create texture when video can play
      const handleCanPlay = () => {
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        textureRef.current = texture;
        onTextureLoaded(texture);
        
        // Start playback
        video.play().catch(err => {
          console.error("Error playing video:", err);
        });
        
        // Remove event listener
        video.removeEventListener('canplay', handleCanPlay);
      };
      
      // Listen for when video can play
      video.addEventListener('canplay', handleCanPlay);
    }
    
    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [videoUrl, useDefaultVideo, onTextureLoaded]);

  return null;
};

export default VideoTextureManager;
