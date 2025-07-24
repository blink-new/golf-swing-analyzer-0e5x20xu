import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface SwingPhase {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  optimal: number;
  color: string;
}

interface SwingTempoAnalyzerProps {
  videoElement?: HTMLVideoElement | null;
  isAnalyzing: boolean;
}

export const SwingTempoAnalyzer: React.FC<SwingTempoAnalyzerProps> = ({ 
  videoElement, 
  isAnalyzing 
}) => {
  const [currentPhase, setCurrentPhase] = useState<string>('Setup');
  const [tempoScore, setTempoScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Mock swing phases data
  const swingPhases: SwingPhase[] = useMemo(() => [
    { name: 'Setup', startTime: 0, endTime: 0.5, duration: 0.5, optimal: 0.8, color: '#22c55e' },
    { name: 'Takeaway', startTime: 0.5, endTime: 1.2, duration: 0.7, optimal: 0.8, color: '#3b82f6' },
    { name: 'Backswing', startTime: 1.2, endTime: 2.0, duration: 0.8, optimal: 0.9, color: '#8b5cf6' },
    { name: 'Top Position', startTime: 2.0, endTime: 2.3, duration: 0.3, optimal: 0.4, color: '#f59e0b' },
    { name: 'Downswing', startTime: 2.3, endTime: 2.8, duration: 0.5, optimal: 0.4, color: '#ef4444' },
    { name: 'Impact', startTime: 2.8, endTime: 2.9, duration: 0.1, optimal: 0.1, color: '#dc2626' },
    { name: 'Follow Through', startTime: 2.9, endTime: 4.0, duration: 1.1, optimal: 1.2, color: '#059669' }
  ], []);

  const tempoRatios = {
    backswingToDownswing: 1.6, // 1.6:1 ratio (optimal is 3:1)
    takeawayToImpact: 2.1,
    overallTempo: 4.0 // Total swing time in seconds
  };

  useEffect(() => {
    if (videoElement && isPlaying) {
      const updateTime = () => {
        setCurrentTime(videoElement.currentTime);
        
        // Determine current phase based on video time
        const phase = swingPhases.find(p => 
          videoElement.currentTime >= p.startTime && videoElement.currentTime <= p.endTime
        );
        if (phase) {
          setCurrentPhase(phase.name);
        }
      };

      const interval = setInterval(updateTime, 50);
      return () => clearInterval(interval);
    }
  }, [videoElement, isPlaying, swingPhases]);

  useEffect(() => {
    // Calculate tempo score based on phase durations
    let score = 0;
    swingPhases.forEach(phase => {
      const accuracy = Math.max(0, 100 - Math.abs(phase.duration - phase.optimal) * 100);
      score += accuracy;
    });
    setTempoScore(Math.round(score / swingPhases.length));
  }, [swingPhases]);

  const getTempoRating = (score: number) => {
    if (score >= 90) return { rating: 'Excellent', color: 'bg-green-500' };
    if (score >= 80) return { rating: 'Good', color: 'bg-blue-500' };
    if (score >= 70) return { rating: 'Average', color: 'bg-yellow-500' };
    return { rating: 'Needs Work', color: 'bg-red-500' };
  };

  const togglePlayback = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetAnalysis = () => {
    if (videoElement) {
      videoElement.currentTime = 0;
      setCurrentTime(0);
      setCurrentPhase('Setup');
      setIsPlaying(false);
    }
  };

  const { rating, color } = getTempoRating(tempoScore);

  return (
    <div className="space-y-6">
      {/* Tempo Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Swing Tempo Analysis
            <Badge className={`${color} text-white`}>
              {rating} ({tempoScore}/100)
            </Badge>
          </CardTitle>
          <CardDescription>
            Analyzing swing rhythm and timing across all phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Tempo Score</span>
                <span>{tempoScore}/100</span>
              </div>
              <Progress value={tempoScore} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {tempoRatios.backswingToDownswing}:1
                </div>
                <div className="text-sm text-gray-600">Backswing:Downswing</div>
                <div className="text-xs text-gray-500">Optimal: 3:1</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tempoRatios.overallTempo}s
                </div>
                <div className="text-sm text-gray-600">Total Swing Time</div>
                <div className="text-xs text-gray-500">Optimal: 3.5-4.5s</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentPhase}
                </div>
                <div className="text-sm text-gray-600">Current Phase</div>
                <div className="text-xs text-gray-500">Time: {currentTime.toFixed(1)}s</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Swing Phase Breakdown</CardTitle>
          <CardDescription>
            Detailed timing analysis for each swing phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {swingPhases.map((phase, index) => {
              const isActive = phase.name === currentPhase;
              const accuracy = Math.max(0, 100 - Math.abs(phase.duration - phase.optimal) * 100);
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                      <span className="font-medium">{phase.name}</span>
                      {isActive && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {phase.duration.toFixed(1)}s / {phase.optimal.toFixed(1)}s
                      </div>
                      <div className="text-xs text-gray-500">
                        {accuracy.toFixed(0)}% accuracy
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={accuracy} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{phase.startTime.toFixed(1)}s - {phase.endTime.toFixed(1)}s</span>
                      <span>
                        {accuracy >= 90 ? '✅ Excellent' : 
                         accuracy >= 80 ? '👍 Good' : 
                         accuracy >= 70 ? '⚠️ Average' : '❌ Needs Work'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tempo Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={togglePlayback} variant="outline">
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'} Analysis
            </Button>
            <Button onClick={resetAnalysis} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Tempo Recommendations:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Maintain a 3:1 backswing to downswing ratio for optimal power</li>
              <li>• Keep total swing time between 3.5-4.5 seconds</li>
              <li>• Focus on smooth transition at the top of backswing</li>
              <li>• Accelerate gradually through impact zone</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};