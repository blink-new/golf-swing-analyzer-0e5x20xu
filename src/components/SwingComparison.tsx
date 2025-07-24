import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SwingData {
  id: string;
  date: string;
  tempo: number;
  posture: number;
  followThrough: number;
  ballStriking: number;
  ballSpin: number;
  ballStraightness: number;
  attackAngle: number;
  swingPath: number;
  clubFaceAngle: number;
  smashFactor: number;
  clubHeadSpeed: number;
  carryDistance: number;
}

interface SwingComparisonProps {
  currentSwing: SwingData;
  previousSwings: SwingData[];
}

const SwingComparison: React.FC<SwingComparisonProps> = ({ currentSwing, previousSwings }) => {
  const [selectedComparison, setSelectedComparison] = useState<SwingData | null>(
    previousSwings.length > 0 ? previousSwings[0] : null
  );

  const getImprovement = (current: number, previous: number) => {
    const diff = current - previous;
    const percentage = ((diff / previous) * 100).toFixed(1);
    return { diff: diff.toFixed(1), percentage };
  };

  const getImprovementIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getImprovementColor = (diff: number) => {
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-400';
  };

  const metrics = [
    { key: 'tempo', label: 'Tempo', unit: '/100' },
    { key: 'posture', label: 'Posture', unit: '/100' },
    { key: 'followThrough', label: 'Follow Through', unit: '/100' },
    { key: 'ballStriking', label: 'Ball Striking', unit: '/100' },
    { key: 'ballSpin', label: 'Ball Spin', unit: ' RPM' },
    { key: 'ballStraightness', label: 'Ball Straightness', unit: '/100' },
    { key: 'attackAngle', label: 'Attack Angle', unit: '°' },
    { key: 'swingPath', label: 'Swing Path', unit: '°' },
    { key: 'clubFaceAngle', label: 'Club Face Angle', unit: '°' },
    { key: 'smashFactor', label: 'Smash Factor', unit: '' },
    { key: 'clubHeadSpeed', label: 'Club Head Speed', unit: ' mph' },
    { key: 'carryDistance', label: 'Carry Distance', unit: ' yds' }
  ];

  if (!selectedComparison) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Swing Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No previous swings available for comparison.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Swing Comparison
            <Badge variant="outline">Before vs After</Badge>
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            {previousSwings.map((swing) => (
              <Button
                key={swing.id}
                variant={selectedComparison.id === swing.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedComparison(swing)}
              >
                {swing.date}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric) => {
                  const currentValue = currentSwing[metric.key as keyof SwingData] as number;
                  const previousValue = selectedComparison[metric.key as keyof SwingData] as number;
                  const improvement = getImprovement(currentValue, previousValue);
                  
                  return (
                    <div key={metric.key} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <div className="flex items-center gap-1">
                          {getImprovementIcon(parseFloat(improvement.diff))}
                          <span className={`text-sm font-medium ${getImprovementColor(parseFloat(improvement.diff))}`}>
                            {improvement.diff > 0 ? '+' : ''}{improvement.diff}{metric.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Previous</span>
                          <span>{previousValue}{metric.unit}</span>
                        </div>
                        <Progress value={Math.min(previousValue, 100)} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current</span>
                          <span className="font-medium">{currentValue}{metric.unit}</span>
                        </div>
                        <Progress value={Math.min(currentValue, 100)} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Previous Swing</CardTitle>
                    <p className="text-sm text-gray-600">{selectedComparison.date}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Overall Score</span>
                        <span className="font-medium">
                          {Math.round((selectedComparison.tempo + selectedComparison.posture + selectedComparison.followThrough) / 3)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Club Head Speed</span>
                        <span className="font-medium">{selectedComparison.clubHeadSpeed} mph</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carry Distance</span>
                        <span className="font-medium">{selectedComparison.carryDistance} yds</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Swing</CardTitle>
                    <p className="text-sm text-gray-600">{currentSwing.date}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Overall Score</span>
                        <span className="font-medium">
                          {Math.round((currentSwing.tempo + currentSwing.posture + currentSwing.followThrough) / 3)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Club Head Speed</span>
                        <span className="font-medium">{currentSwing.clubHeadSpeed} mph</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carry Distance</span>
                        <span className="font-medium">{currentSwing.carryDistance} yds</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.slice(0, 6).map((metric) => {
                      const currentValue = currentSwing[metric.key as keyof SwingData] as number;
                      const previousValue = selectedComparison[metric.key as keyof SwingData] as number;
                      const improvement = getImprovement(currentValue, previousValue);
                      
                      if (Math.abs(parseFloat(improvement.diff)) < 0.1) return null;
                      
                      return (
                        <div key={metric.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getImprovementIcon(parseFloat(improvement.diff))}
                            <span className="font-medium">{metric.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {previousValue}{metric.unit}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {currentValue}{metric.unit}
                            </span>
                            <Badge 
                              variant={parseFloat(improvement.diff) > 0 ? "default" : "destructive"}
                              className="ml-2"
                            >
                              {improvement.percentage}%
                            </Badge>
                          </div>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Coaching Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const recommendations = [];
                      
                      // Tempo recommendations
                      const tempoImprovement = getImprovement(currentSwing.tempo, selectedComparison.tempo);
                      if (parseFloat(tempoImprovement.diff) < -5) {
                        recommendations.push({
                          category: "Tempo",
                          priority: "High",
                          message: "Your swing tempo has decreased. Focus on maintaining a smooth 3:1 backswing to downswing ratio.",
                          action: "Practice with a metronome or tempo trainer"
                        });
                      }
                      
                      // Ball striking recommendations
                      const strikingImprovement = getImprovement(currentSwing.ballStriking, selectedComparison.ballStriking);
                      if (parseFloat(strikingImprovement.diff) < -3) {
                        recommendations.push({
                          category: "Ball Striking",
                          priority: "High",
                          message: "Ball contact quality needs improvement. Focus on maintaining proper posture through impact.",
                          action: "Practice impact bag drills and alignment stick exercises"
                        });
                      }
                      
                      // Club face angle recommendations
                      const faceAngleImprovement = getImprovement(Math.abs(currentSwing.clubFaceAngle), Math.abs(selectedComparison.clubFaceAngle));
                      if (parseFloat(faceAngleImprovement.diff) > 1) {
                        recommendations.push({
                          category: "Club Face Control",
                          priority: "Medium",
                          message: "Club face angle at impact is less consistent. Work on grip pressure and wrist position.",
                          action: "Practice slow-motion swings focusing on face control"
                        });
                      }
                      
                      // Positive reinforcement
                      const distanceImprovement = getImprovement(currentSwing.carryDistance, selectedComparison.carryDistance);
                      if (parseFloat(distanceImprovement.diff) > 5) {
                        recommendations.push({
                          category: "Distance",
                          priority: "Positive",
                          message: `Excellent improvement in carry distance (+${distanceImprovement.diff} yards)! Your power generation is improving.`,
                          action: "Continue current training routine and focus on consistency"
                        });
                      }
                      
                      if (recommendations.length === 0) {
                        recommendations.push({
                          category: "Overall",
                          priority: "Positive",
                          message: "Great consistency between swings! Focus on maintaining your current form.",
                          action: "Continue regular practice and consider working on advanced techniques"
                        });
                      }
                      
                      return recommendations;
                    })().map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{rec.category}</span>
                          <Badge 
                            variant={
                              rec.priority === "High" ? "destructive" : 
                              rec.priority === "Medium" ? "secondary" : 
                              "default"
                            }
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{rec.message}</p>
                        <p className="text-sm font-medium text-golf-primary">{rec.action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwingComparison;