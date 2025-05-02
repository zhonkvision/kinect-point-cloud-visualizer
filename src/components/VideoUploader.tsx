
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onVideoChange: (url: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export interface VideoUploaderHandle {
  triggerFileInput: () => void;
}

const VideoUploader = forwardRef<VideoUploaderHandle, VideoUploaderProps>(
  ({ onVideoChange, canvasRef }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    useImperativeHandle(ref, () => ({
      triggerFileInput: () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      },
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        
        // Validate file type
        if (!file.type.includes('video/')) {
          toast({
            title: "Invalid file type",
            description: "Please upload an MP4 or WebM video file",
            variant: "destructive"
          });
          return;
        }
        
        // Create object URL for the uploaded video
        const objectUrl = URL.createObjectURL(file);
        onVideoChange(objectUrl);
        
        toast({
          title: "Video uploaded",
          description: "Your video is now ready for processing",
        });
      }
    };

    return (
      <>
        <Input 
          type="file" 
          accept="video/mp4,video/webm" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <video 
          ref={videoElementRef} 
          style={{ display: 'none' }} 
          controls 
          muted
        />
      </>
    );
  }
);

VideoUploader.displayName = "VideoUploader";

export default VideoUploader;
