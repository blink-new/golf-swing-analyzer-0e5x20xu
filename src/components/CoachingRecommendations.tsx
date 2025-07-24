import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  Video,
  Trophy,
  Zap
} from 'lucide-react';

interface SwingData {
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
  backswingLength: number;
  weightTransfer: number;
}

interface CoachingRecommendationsProps {
  swingData: SwingData;
  previousSwings?: SwingData[];
}

const CoachingRecommendations: React.FC<CoachingRecommendationsProps> = ({ 
  swingData, 
  previousSwings = [] 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'immediate' | 'technique' | 'practice' | 'equipment'>('immediate');
  
  // Calculate improvement priorities
  const getImprovementPriority = (metric: keyof SwingData, optimalRange: [number, number]) => {
    const value = swingData[metric] as number;
    const [min, max] = optimalRange;
    
    if (value >= min && value <= max) return 'good';
    if (value < min - 10 || value > max + 10) return 'critical';
    return 'needs-work';
  };
  
  const priorities = {
    tempo: getImprovementPriority('tempo', [75, 90]),
    posture: getImprovementPriority('posture', [80, 95]),
    followThrough: getImprovementPriority('followThrough', [75, 90]),
    ballStriking: getImprovementPriority('ballStriking', [80, 95]),
    attackAngle: getImprovementPriority('attackAngle', [-4, 4]),
    swingPath: getImprovementPriority('swingPath', [-2, 2]),
    clubFaceAngle: getImprovementPriority('clubFaceAngle', [-2, 2]),
    smashFactor: getImprovementPriority('smashFactor', [1.3, 1.5])
  };
  
  const criticalIssues = Object.entries(priorities).filter(([_, priority]) => priority === 'critical');
  const needsWork = Object.entries(priorities).filter(([_, priority]) => priority === 'needs-work');
  
  const immediateRecommendations = [
    ...(swingData.tempo < 70 ? [{
      title: "Slow Down Your Tempo",
      priority: "Critical" as const,
      description: "Your swing tempo is too fast. Focus on a smooth, controlled backswing.",
      action: "Practice counting '1-2-3' on backswing, '1' on downswing",
      icon: <Clock className="w-5 h-5" />
    }] : []),
    
    ...(Math.abs(swingData.clubFaceAngle) > 3 ? [{
      title: "Club Face Control",
      priority: "High" as const,
      description: "Your club face is too open/closed at impact, causing directional issues.",
      action: "Check your grip - ensure V's point between chin and right shoulder",
      icon: <Target className="w-5 h-5" />
    }] : []),
    
    ...(swingData.ballStriking < 75 ? [{
      title: "Improve Ball Contact",
      priority: "High" as const,
      description: "Inconsistent ball striking is limiting your distance and accuracy.",
      action: "Focus on keeping your head steady and maintaining spine angle",
      icon: <AlertTriangle className="w-5 h-5" />
    }] : []),
    
    ...(Math.abs(swingData.swingPath) > 3 ? [{
      title: "Swing Path Correction",
      priority: "Medium" as const,
      description: swingData.swingPath > 0 ? "You're swinging too much from inside-out" : "You're swinging too much from outside-in",
      action: swingData.swingPath > 0 ? "Practice swinging more left through impact" : "Practice swinging more right through impact",
      icon: <TrendingUp className="w-5 h-5" />
    }] : [])
  ];
  
  const techniqueRecommendations = [
    {
      category: "Setup & Posture",
      recommendations: [
        {
          title: "Address Position",
          description: "Maintain athletic posture with slight knee flex and straight back",
          difficulty: "Beginner",
          timeToImprove: "1-2 weeks",
          drills: ["Mirror work", "Wall drill for posture", "Setup routine practice"]
        },
        {
          title: "Grip Fundamentals",
          description: "Ensure proper grip pressure and hand positioning",
          difficulty: "Beginner",
          timeToImprove: "2-3 weeks",
          drills: ["Grip pressure drill", "Alignment stick grip check", "Towel under arms drill"]
        }
      ]
    },
    {
      category: "Backswing",
      recommendations: [
        {
          title: "Takeaway Path",
          description: "Keep club on plane during first 18 inches of backswing",
          difficulty: "Intermediate",
          timeToImprove: "3-4 weeks",
          drills: ["Alignment stick plane drill", "One-piece takeaway", "Slow motion practice"]
        },
        {
          title: "Top Position",
          description: "Achieve proper shoulder turn and club position at top",
          difficulty: "Intermediate",
          timeToImprove: "4-6 weeks",
          drills: ["Cross-armed drill", "Shoulder turn exercises", "Mirror feedback"]
        }
      ]
    },
    {
      category: "Downswing & Impact",
      recommendations: [
        {
          title: "Weight Transfer",
          description: "Proper sequence from ground up through impact",
          difficulty: "Advanced",
          timeToImprove: "6-8 weeks",
          drills: ["Step drill", "Pump drill", "Impact bag training"]
        },
        {
          title: "Release Pattern",
          description: "Proper hand and wrist action through impact zone",
          difficulty: "Advanced",
          timeToImprove: "8-12 weeks",
          drills: ["Towel drill", "Split grip drill", "Impact position holds"]
        }
      ]
    }
  ];
  
  const practiceRecommendations = [
    {
      title: "Daily Practice Routine (15 minutes)",
      exercises: [
        { name: "Setup Position", duration: "3 minutes", reps: "10 setups" },
        { name: "Slow Motion Swings", duration: "5 minutes", reps: "20 swings" },
        { name: "Impact Position", duration: "4 minutes", reps: "15 holds" },
        { name: "Tempo Training", duration: "3 minutes", reps: "10 swings" }
      ]
    },
    {
      title: "Weekly Practice Plan",
      sessions: [
        { day: "Monday", focus: "Setup & Posture", duration: "30 minutes" },
        { day: "Wednesday", focus: "Swing Plane & Path", duration: "45 minutes" },
        { day: "Friday", focus: "Tempo & Rhythm", duration: "30 minutes" },
        { day: "Saturday", focus: "On-Course Practice", duration: "2 hours" }
      ]
    }
  ];
  
  const equipmentRecommendations = [
    ...(swingData.clubHeadSpeed < 85 ? [{
      category: "Club Selection",
      recommendation: "Consider more flexible shaft",
      reason: "Your swing speed suggests a regular or senior flex shaft would help",
      impact: "Increased distance and better feel"
    }] : []),
    
    ...(swingData.smashFactor < 1.3 ? [{
      category: "Club Fitting",
      recommendation: "Professional club fitting recommended",
      reason: "Low smash factor indicates equipment optimization needed",
      impact: "Improved energy transfer and consistency"
    }] : []),
    
    {
      category: "Training Aids",
      recommendation: "Alignment sticks and impact bag",
      reason: "Based on your swing path and contact issues",
      impact: "Better swing plane and impact position"
    }
  ];
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'secondary';
      case 'Medium': return 'outline';
      default: return 'default';
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            AI Golf Coach Recommendations
          </CardTitle>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {criticalIssues.length} Critical
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {needsWork.length} Needs Work
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {8 - criticalIssues.length - needsWork.length} Good
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="immediate" className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Immediate
              </TabsTrigger>
              <TabsTrigger value="technique" className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Technique
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Equipment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="immediate" className="space-y-4">
              <div className="space-y-4">
                {immediateRecommendations.length > 0 ? (
                  immediateRecommendations.map((rec, index) => (
                    <Card key={index} className="border-l-4 border-l-golf-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="text-golf-primary">{rec.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <Badge variant={getPriorityColor(rec.priority) as any}>
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{rec.description}</p>
                            <div className="bg-golf-primary/10 p-3 rounded-lg">
                              <p className="font-medium text-golf-primary">Action: {rec.action}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-700">Great Swing!</h3>
                      <p className="text-gray-600">No immediate issues detected. Focus on consistency.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="technique" className="space-y-6">
              {techniqueRecommendations.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.recommendations.map((rec, recIndex) => (
                        <div key={recIndex} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <div className="flex gap-2">
                              <Badge className={getDifficultyColor(rec.difficulty)}>
                                {rec.difficulty}
                              </Badge>
                              <Badge variant="outline">{rec.timeToImprove}</Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{rec.description}</p>
                          <div>
                            <h5 className="font-medium mb-2">Recommended Drills:</h5>
                            <div className="flex flex-wrap gap-2">
                              {rec.drills.map((drill, drillIndex) => (
                                <Badge key={drillIndex} variant="secondary">
                                  {drill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="practice" className="space-y-6">
              {practiceRecommendations.map((plan, planIndex) => (
                <Card key={planIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {plan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {'exercises' in plan ? (
                      <div className="space-y-3">
                        {plan.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <p className="text-sm text-gray-600">{exercise.reps}</p>
                            </div>
                            <Badge variant="outline">{exercise.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {plan.sessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{session.day}</h4>
                              <p className="text-sm text-gray-600">{session.focus}</p>
                            </div>
                            <Badge variant="outline">{session.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="equipment" className="space-y-4">
              {equipmentRecommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-golf-accent mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{rec.category}</h4>
                          <Badge variant="outline">Equipment</Badge>
                        </div>
                        <p className="font-medium text-golf-primary mb-1">{rec.recommendation}</p>
                        <p className="text-gray-600 text-sm mb-2">{rec.reason}</p>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-sm text-green-700">Expected Impact: {rec.impact}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Improvement Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(priorities).map(([metric, priority]) => {
              const value = swingData[metric as keyof SwingData] as number;
              const isGood = priority === 'good';
              
              return (
                <div key={metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{value}</span>
                      <Badge 
                        variant={isGood ? "default" : priority === 'critical' ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {priority === 'good' ? 'Good' : priority === 'critical' ? 'Critical' : 'Needs Work'}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={isGood ? 85 : priority === 'critical' ? 25 : 60} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachingRecommendations;