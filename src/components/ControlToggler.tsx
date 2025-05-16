
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlTogglerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const ControlToggler: React.FC<ControlTogglerProps> = ({ 
  isOpen, 
  onClick,
  className
}) => {
  const [isActive, setIsActive] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Handler for mouse movement
  const handleMouseMove = () => {
    setIsActive(true);
    
    // Reset existing timer
    if (timer) {
      clearTimeout(timer);
    }
    
    // Set new timer to fade out after inactivity
    const newTimer = setTimeout(() => {
      if (!isOpen) {
        setIsActive(false);
      }
    }, 3000); // 3 seconds
    
    setTimer(newTimer);
  };

  // Set up and clean up event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial timer setup
    const initialTimer = setTimeout(() => {
      if (!isOpen) {
        setIsActive(false);
      }
    }, 3000);
    
    setTimer(initialTimer);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen]);
  
  // Always show at full opacity when open
  useEffect(() => {
    if (isOpen) {
      setIsActive(true);
    }
  }, [isOpen]);

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed z-50 bottom-8 right-8 w-14 h-14 rounded-full bg-black/80 border-2 border-cyan-500/50 flex items-center justify-center",
        "hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]",
        isActive ? "opacity-100" : "opacity-10",
        className
      )}
      aria-label={isOpen ? "Hide Controls" : "Show Controls"}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-cyan-400" />
      ) : (
        <Menu className="w-6 h-6 text-cyan-400" />
      )}
      <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-pulse" />
    </Button>
  );
};

export default ControlToggler;
