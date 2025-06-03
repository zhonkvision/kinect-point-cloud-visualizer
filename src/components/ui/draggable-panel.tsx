
import * as React from "react";
import { cn } from "@/lib/utils";
import { Rnd } from "react-rnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number | string;
  height: number | string;
}

export interface DraggablePanelProps {
  title: string;
  icon?: React.ReactNode;
  defaultPosition?: Position;
  defaultSize?: Size;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  onClose?: () => void;
  isCollapsible?: boolean;
  id: string;
}

export function DraggablePanel({
  title,
  icon,
  defaultPosition = { x: 20, y: 20 },
  defaultSize = { width: 300, height: 'auto' },
  className,
  contentClassName,
  children,
  onClose,
  isCollapsible = true,
  id,
}: DraggablePanelProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [position, setPosition] = React.useState<Position>(defaultPosition);
  const [size, setSize] = React.useState<Size>(defaultSize);

  // Save panel position and state to localStorage
  React.useEffect(() => {
    const savedPosition = localStorage.getItem(`panel-${id}-position`);
    const savedSize = localStorage.getItem(`panel-${id}-size`);
    const savedCollapsed = localStorage.getItem(`panel-${id}-collapsed`);
    
    if (savedPosition) setPosition(JSON.parse(savedPosition));
    if (savedSize) setSize(JSON.parse(savedSize));
    if (savedCollapsed) setIsCollapsed(savedCollapsed === 'true');
  }, [id]);

  const savePosition = (newPosition: Position) => {
    setPosition(newPosition);
    localStorage.setItem(`panel-${id}-position`, JSON.stringify(newPosition));
  };

  const saveSize = (newSize: Size) => {
    setSize(newSize);
    localStorage.setItem(`panel-${id}-size`, JSON.stringify(newSize));
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(`panel-${id}-collapsed`, String(newState));
  };

  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      position={{ x: position.x, y: position.y }}
      size={{ width: size.width, height: isCollapsed ? 'auto' : size.height }}
      minWidth={200}
      minHeight={isCollapsed ? 50 : 100}
      bounds="window"
      onDragStop={(e, d) => {
        savePosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        saveSize({
          width: ref.style.width,
          height: isCollapsed ? 'auto' : ref.style.height,
        });
        savePosition(position);
      }}
      enableResizing={!isCollapsed}
      disableDragging={false}
      className="absolute z-30"
    >
      <Card 
        className={cn(
          "w-full h-full overflow-hidden border border-cyan-500/20 bg-black/85 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,255,255,0.1)] text-cyan-300 transition-all duration-200",
          className
        )}
      >
        <CardHeader className="bg-gradient-to-r from-cyan-950/60 to-cyan-900/40 px-3 py-2 flex flex-row items-center space-y-0 cursor-move border-b border-cyan-500/10">
          <div className="flex items-center gap-2 flex-1">
            {icon && <span className="text-cyan-400">{icon}</span>}
            <CardTitle className="text-cyan-300 font-medium text-xs font-sans tracking-wider uppercase">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {isCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-950/30 transition-all duration-200"
                onClick={toggleCollapse}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-cyan-400/70 hover:text-red-300 hover:bg-red-950/30 transition-all duration-200"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent 
            className={cn(
              "p-3 overflow-y-auto max-h-[calc(100%-40px)] bg-black/20",
              contentClassName
            )}
          >
            {children}
          </CardContent>
        )}
      </Card>
    </Rnd>
  );
}
