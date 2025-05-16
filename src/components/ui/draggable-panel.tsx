
import * as React from "react";
import { cn } from "@/lib/utils";
import { Rnd } from "react-rnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DraggablePanelProps {
  title: string;
  icon?: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
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
  const [position, setPosition] = React.useState(defaultPosition);
  const [size, setSize] = React.useState(defaultSize);

  // Save panel position and state to localStorage
  React.useEffect(() => {
    const savedPosition = localStorage.getItem(`panel-${id}-position`);
    const savedSize = localStorage.getItem(`panel-${id}-size`);
    const savedCollapsed = localStorage.getItem(`panel-${id}-collapsed`);
    
    if (savedPosition) setPosition(JSON.parse(savedPosition));
    if (savedSize) setSize(JSON.parse(savedSize));
    if (savedCollapsed) setIsCollapsed(savedCollapsed === 'true');
  }, [id]);

  const savePosition = (newPosition: { x: number, y: number }) => {
    setPosition(newPosition);
    localStorage.setItem(`panel-${id}-position`, JSON.stringify(newPosition));
  };

  const saveSize = (newSize: { width: number | string, height: number | string }) => {
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
          "w-full h-full overflow-hidden border border-cyan-500/30 bg-black/80 shadow-[0_0_10px_rgba(0,255,255,0.2)] text-cyan-300",
          className
        )}
      >
        <CardHeader className="bg-cyan-950/40 px-4 py-2 flex flex-row items-center space-y-0 cursor-move">
          <div className="flex items-center gap-2 flex-1">
            {icon && <span className="text-cyan-500">{icon}</span>}
            <CardTitle className="text-cyan-400 font-mono text-sm font-bold tracking-wider uppercase">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {isCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50"
                onClick={toggleCollapse}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-cyan-400 hover:text-red-300 hover:bg-red-950/50"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent 
            className={cn(
              "p-3 overflow-y-auto max-h-[calc(100%-40px)]",
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
