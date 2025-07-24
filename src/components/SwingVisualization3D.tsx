import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { RotateCcw, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface SwingVisualization3DProps {
  swingData: {
    tempo: number;
    posture: number;
    followThrough: number;
    attackAngle: number;
    swingPath: number;
    clubFaceAngle: number;
  };
}

const SwingVisualization3D: React.FC<SwingVisualization3DProps> = ({ swingData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedView, setSelectedView] = useState<'front' | 'side' | 'top' | 'behind'>('side');
  
  const totalFrames = 120; // 2 seconds at 60fps
  
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= ctx.canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= ctx.canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
    
    // Center lines
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, ctx.canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(ctx.canvas.width, centerY);
    ctx.stroke();
  }, []);
  
  const getSwingPhase = useCallback((progress: number) => {
    if (progress < 0.1) return { phase: 'address', progress: progress / 0.1 };
    if (progress < 0.3) return { phase: 'backswing', progress: (progress - 0.1) / 0.2 };
    if (progress < 0.35) return { phase: 'transition', progress: (progress - 0.3) / 0.05 };
    if (progress < 0.5) return { phase: 'downswing', progress: (progress - 0.35) / 0.15 };
    if (progress < 0.52) return { phase: 'impact', progress: (progress - 0.5) / 0.02 };
    return { phase: 'followthrough', progress: (progress - 0.52) / 0.48 };
  }, []);
  
  const drawClub = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, faceAngle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    
    // Club shaft
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 100);
    ctx.stroke();
    
    // Club head
    ctx.save();
    ctx.translate(0, 100);
    ctx.rotate((faceAngle * Math.PI) / 180);
    ctx.fillStyle = '#374151';
    ctx.fillRect(-8, -3, 16, 6);
    ctx.restore();
    
    ctx.restore();
  }, []);
  
  const drawSwingPath = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, swingPath: number) => {
    // Draw swing path indicator
    ctx.strokeStyle = swingPath > 0 ? '#ef4444' : swingPath < 0 ? '#3b82f6' : '#22c55e';
    ctx.lineWidth = 3;
    
    const pathOffset = swingPath * 2; // Exaggerate for visibility
    ctx.beginPath();
    ctx.moveTo(x - 50, y);
    ctx.quadraticCurveTo(x + pathOffset, y - 20, x + 50, y);
    ctx.stroke();
  }, []);
  
  const drawSideView = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, swingPhase: any) => {
    const { phase, progress } = swingPhase;
    
    // Draw golfer body
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 4;
    
    // Head
    ctx.beginPath();
    ctx.arc(centerX - 20, centerY - 120, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Body
    const bodyTilt = phase === 'address' ? 0 : 
                    phase === 'backswing' ? -5 * progress :
                    phase === 'downswing' ? 5 * progress :
                    phase === 'impact' ? 10 :
                    phase === 'followthrough' ? -10 * progress : 0;
    
    ctx.save();
    ctx.translate(centerX, centerY - 80);
    ctx.rotate((bodyTilt * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.restore();
    
    // Arms and club
    const clubAngle = phase === 'address' ? -10 :
                     phase === 'backswing' ? -10 - (120 * progress) :
                     phase === 'transition' ? -130 :
                     phase === 'downswing' ? -130 + (140 * progress) :
                     phase === 'impact' ? 10 :
                     phase === 'followthrough' ? 10 + (100 * progress) : -10;
    
    drawClub(ctx, centerX - 10, centerY - 40, clubAngle, swingData.clubFaceAngle);
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY + 40);
    ctx.lineTo(centerX - 15, centerY + 100);
    ctx.moveTo(centerX + 5, centerY + 40);
    ctx.lineTo(centerX + 15, centerY + 100);
    ctx.stroke();
  }, [drawClub, swingData.clubFaceAngle]);
  
  const drawFrontView = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, swingPhase: any) => {
    const { phase, progress } = swingPhase;
    
    // Draw golfer from front
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 4;
    
    // Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - 120, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Shoulders
    const shoulderRotation = phase === 'backswing' ? 45 * progress :
                            phase === 'downswing' ? 45 - (90 * progress) :
                            phase === 'followthrough' ? -45 * progress : 0;
    
    ctx.save();
    ctx.translate(centerX, centerY - 80);
    ctx.rotate((shoulderRotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 80);
    ctx.lineTo(centerX, centerY + 40);
    ctx.stroke();
    
    // Show swing path
    drawSwingPath(ctx, centerX, centerY - 40, swingData.swingPath);
  }, [drawSwingPath, swingData.swingPath]);
  
  const drawTopView = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, swingPhase: any) => {
    // Draw from above showing swing plane
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    
    // Golfer position (circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Club path arc
    const { phase, progress } = swingPhase;
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI / 2;
    const currentAngle = startAngle + (endAngle - startAngle) * 
      (phase === 'backswing' ? progress :
       phase === 'downswing' ? 1 - progress :
       phase === 'followthrough' ? 1 + progress : 0);
    
    // Draw swing arc
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, startAngle, endAngle);
    ctx.stroke();
    
    // Draw current club position
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    const clubX = centerX + Math.cos(currentAngle) * 80;
    const clubY = centerY + Math.sin(currentAngle) * 80;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(clubX, clubY);
    ctx.stroke();
  }, []);
  
  const drawBehindView = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, swingPhase: any) => {
    // Similar to side view but from behind
    drawSideView(ctx, centerX, centerY, swingPhase);
    
    // Add target line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 120);
    ctx.lineTo(centerX, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [drawSideView]);
  
  const drawSwingPlane = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (selectedView !== 'side') return;
    
    // Draw ideal swing plane
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX - 100, centerY + 50);
    ctx.lineTo(centerX + 50, centerY - 100);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add plane indicator
    ctx.fillStyle = '#22c55e';
    ctx.font = '12px Inter';
    ctx.fillText('Ideal Swing Plane', centerX - 80, centerY + 70);
  }, [selectedView]);
  
  const drawBallAndTarget = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX + 30, centerY + 100, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw target line
    if (selectedView === 'top') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + 30, centerY + 100);
      ctx.lineTo(centerX + 30, 50);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [selectedView]);
  
  const drawPhaseIndicator = useCallback((ctx: CanvasRenderingContext2D, swingPhase: any) => {
    const { phase } = swingPhase;
    
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(`Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}`, 20, 30);
    
    // Phase progress bar
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(20, 40, 200, 8);
    ctx.stroke();
    
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(22, 42, (currentFrame / totalFrames) * 196, 4);
  }, [currentFrame, totalFrames]);
  
  const drawSwingVisualization = useCallback((ctx: CanvasRenderingContext2D, frame: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Set up coordinate system
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw background grid
    drawGrid(ctx, centerX, centerY);
    
    // Calculate swing phase
    const progress = frame / totalFrames;
    const swingPhase = getSwingPhase(progress);
    
    // Draw golfer and club based on view
    switch (selectedView) {
      case 'side':
        drawSideView(ctx, centerX, centerY, swingPhase);
        break;
      case 'front':
        drawFrontView(ctx, centerX, centerY, swingPhase);
        break;
      case 'top':
        drawTopView(ctx, centerX, centerY, swingPhase);
        break;
      case 'behind':
        drawBehindView(ctx, centerX, centerY, swingPhase);
        break;
    }
    
    // Draw swing plane
    drawSwingPlane(ctx, centerX, centerY);
    
    // Draw ball and target line
    drawBallAndTarget(ctx, centerX, centerY);
    
    // Draw phase indicator
    drawPhaseIndicator(ctx, swingPhase);
  }, [selectedView, totalFrames, drawGrid, getSwingPhase, drawSideView, drawFrontView, drawTopView, drawBehindView, drawSwingPlane, drawBallAndTarget, drawPhaseIndicator]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
    
    drawSwingVisualization(ctx, currentFrame);
  }, [currentFrame, drawSwingVisualization]);
  
  const animate = useCallback(() => {
    if (isPlaying) {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, totalFrames]);
  
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };
  
  const handleFrameChange = (value: number[]) => {
    setCurrentFrame(value[0]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          3D Swing Visualization
          <Badge variant="outline">Interactive</Badge>
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {(['front', 'side', 'top', 'behind'] as const).map((view) => (
            <Button
              key={view}
              variant={selectedView === view ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} View
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <canvas
              ref={canvasRef}
              className="w-full h-auto border rounded"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => setCurrentFrame(Math.max(0, currentFrame - 5))}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={() => setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 5))}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <Slider
                value={[currentFrame]}
                onValueChange={handleFrameChange}
                max={totalFrames - 1}
                step={1}
                className="w-full"
              />
            </div>
            
            <span className="text-sm text-gray-600 min-w-fit">
              {currentFrame}/{totalFrames}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium">Attack Angle</div>
              <div className="text-golf-primary">{swingData.attackAngle}°</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Swing Path</div>
              <div className="text-golf-primary">{swingData.swingPath}°</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Club Face</div>
              <div className="text-golf-primary">{swingData.clubFaceAngle}°</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Tempo</div>
              <div className="text-golf-primary">{swingData.tempo}/100</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwingVisualization3D;