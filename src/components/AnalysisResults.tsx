import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from './VideoPlayer'
import { SwingTempoAnalyzer } from './SwingTempoAnalyzer'
import { 
  Target, 
  Clock, 
  User, 
  TrendingUp, 
  Download, 
  Share2,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  RotateCw,
  ArrowRight,
  Activity,
  Crosshair,
  Wind,
  Compass,
  RotateCcw,
  Move3D,
  Gauge
} from 'lucide-react'

interface AnalysisData {
  id: string
  videoUrl: string
  timestamp: Date
  scores: {
    tempo: number
    posture: number
    followThrough: number
    ballStriking: number
    swingPlane: number
    clubFace: number
    overall: number
  }
  ballFlight: {
    distance: number
    accuracy: number
    spin: number
    launch: number
    straightness: number
  }
  swingMetrics: {
    backswingLength: number
    downswingSpeed: number
    impactPosition: number
    weightTransfer: number
    attackAngle: number
    swingPath: number
    clubFaceAngle: number
    smashFactor: number
  }
  feedback: string[]
}

interface AnalysisResultsProps {
  data: AnalysisData
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { variant: 'default' as const, label: 'Excellent', color: 'bg-green-100 text-green-800' }
    if (score >= 70) return { variant: 'secondary' as const, label: 'Good', color: 'bg-yellow-100 text-yellow-800' }
    return { variant: 'destructive' as const, label: 'Needs Work', color: 'bg-red-100 text-red-800' }
  }

  const getFeedbackIcon = (feedback: string) => {
    if (feedback.toLowerCase().includes('excellent') || feedback.toLowerCase().includes('great')) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    }
    if (feedback.toLowerCase().includes('consider') || feedback.toLowerCase().includes('work on')) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
    return <Info className="w-4 h-4 text-blue-600" />
  }

  const getSpinDescription = (spin: number) => {
    if (spin < 2000) return { label: 'Low Spin', color: 'text-blue-600', desc: 'Good for distance' }
    if (spin < 3000) return { label: 'Optimal Spin', color: 'text-green-600', desc: 'Perfect balance' }
    return { label: 'High Spin', color: 'text-red-600', desc: 'May reduce distance' }
  }

  const getLaunchDescription = (launch: number) => {
    if (launch < 10) return { label: 'Low Launch', color: 'text-red-600' }
    if (launch < 15) return { label: 'Optimal Launch', color: 'text-green-600' }
    return { label: 'High Launch', color: 'text-yellow-600' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Comprehensive Swing Analysis</span>
              </CardTitle>
              <CardDescription>
                Analysis completed on {data.timestamp.toLocaleDateString()} at {data.timestamp.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className={`text-3xl font-bold ${getScoreColor(data.scores.overall)}`}>
                  {data.scores.overall}
                </span>
              </div>
              <Badge className={getScoreBadge(data.scores.overall).color}>
                {getScoreBadge(data.scores.overall).label}
              </Badge>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Swing Plane</span>
                  <span className={`text-sm font-semibold ${getScoreColor(data.scores.swingPlane)}`}>
                    {data.scores.swingPlane}/100
                  </span>
                </div>
                <Progress value={data.scores.swingPlane} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Ball Striking</span>
                  <span className={`text-sm font-semibold ${getScoreColor(data.scores.ballStriking)}`}>
                    {data.scores.ballStriking}/100
                  </span>
                </div>
                <Progress value={data.scores.ballStriking} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Club Face Control</span>
                  <span className={`text-sm font-semibold ${getScoreColor(data.scores.clubFace)}`}>
                    {data.scores.clubFace}/100
                  </span>
                </div>
                <Progress value={data.scores.clubFace} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Analysis and Tempo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyzed Video with Overlays</CardTitle>
            <CardDescription>Your swing with AI analysis overlay showing swing plane and ball path</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoPlayer videoUrl={data.videoUrl} showAnalysisOverlay={true} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ball Flight Analysis</CardTitle>
            <CardDescription>Predicted ball flight characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <ArrowRight className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{data.ballFlight.distance}y</div>
                <div className="text-sm text-gray-600">Carry Distance</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Crosshair className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{data.ballFlight.accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ball Spin</span>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${getSpinDescription(data.ballFlight.spin).color}`}>
                    {data.ballFlight.spin} RPM
                  </span>
                  <div className="text-xs text-gray-500">{getSpinDescription(data.ballFlight.spin).desc}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Launch Angle</span>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${getLaunchDescription(data.ballFlight.launch).color}`}>
                    {data.ballFlight.launch}°
                  </span>
                  <div className="text-xs text-gray-500">{getLaunchDescription(data.ballFlight.launch).label}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ball Straightness</span>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${getScoreColor(data.ballFlight.straightness)}`}>
                    {data.ballFlight.straightness}/100
                  </span>
                  <div className="text-xs text-gray-500">
                    {data.ballFlight.straightness >= 85 ? 'Very Straight' : 
                     data.ballFlight.straightness >= 70 ? 'Slight Curve' : 'Significant Curve'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swing Tempo Analysis */}
      <SwingTempoAnalyzer videoUrl={data.videoUrl} />

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.scores.tempo}/100</div>
            <Progress value={data.scores.tempo} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {data.scores.tempo >= 85 ? 'Excellent rhythm' : 
               data.scores.tempo >= 70 ? 'Good timing' : 'Work on consistency'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <User className="w-4 h-4 mr-2 text-primary" />
              Posture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.scores.posture}/100</div>
            <Progress value={data.scores.posture} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {data.scores.posture >= 85 ? 'Perfect setup' : 
               data.scores.posture >= 70 ? 'Good alignment' : 'Adjust stance'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.swingMetrics.impactPosition}/100</div>
            <Progress value={data.swingMetrics.impactPosition} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {data.swingMetrics.impactPosition >= 85 ? 'Solid contact' : 
               data.swingMetrics.impactPosition >= 70 ? 'Good strike' : 'Improve contact'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Activity className="w-4 h-4 mr-2 text-primary" />
              Weight Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.swingMetrics.weightTransfer}/100</div>
            <Progress value={data.swingMetrics.weightTransfer} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {data.swingMetrics.weightTransfer >= 85 ? 'Excellent shift' : 
               data.swingMetrics.weightTransfer >= 70 ? 'Good transfer' : 'Work on balance'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Swing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Move3D className="w-4 h-4 mr-2 text-primary" />
              Attack Angle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.swingMetrics.attackAngle > 0 ? '+' : ''}{data.swingMetrics.attackAngle.toFixed(1)}°</div>
            <Progress value={Math.abs(data.swingMetrics.attackAngle) <= 3 ? 100 : 50} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {Math.abs(data.swingMetrics.attackAngle) <= 3 ? 'Optimal angle' : 
               data.swingMetrics.attackAngle > 3 ? 'Too steep' : 'Too shallow'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Compass className="w-4 h-4 mr-2 text-primary" />
              Swing Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.swingMetrics.swingPath > 0 ? '+' : ''}{data.swingMetrics.swingPath.toFixed(1)}°</div>
            <Progress value={Math.abs(data.swingMetrics.swingPath) <= 2 ? 100 : 50} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {Math.abs(data.swingMetrics.swingPath) <= 2 ? 'On target' : 
               data.swingMetrics.swingPath > 2 ? 'Out-to-in' : 'In-to-out'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <RotateCcw className="w-4 h-4 mr-2 text-primary" />
              Club Face
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.swingMetrics.clubFaceAngle > 0 ? '+' : ''}{data.swingMetrics.clubFaceAngle.toFixed(1)}°</div>
            <Progress value={Math.abs(data.swingMetrics.clubFaceAngle) <= 2 ? 100 : 50} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {Math.abs(data.swingMetrics.clubFaceAngle) <= 2 ? 'Square at impact' : 
               data.swingMetrics.clubFaceAngle > 2 ? 'Open face' : 'Closed face'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Gauge className="w-4 h-4 mr-2 text-primary" />
              Smash Factor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.swingMetrics.smashFactor.toFixed(2)}</div>
            <Progress value={data.swingMetrics.smashFactor >= 1.4 ? 100 : (data.swingMetrics.smashFactor / 1.5) * 100} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              {data.swingMetrics.smashFactor >= 1.4 ? 'Excellent efficiency' : 
               data.swingMetrics.smashFactor >= 1.3 ? 'Good contact' : 'Improve strike'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Swing Mechanics Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Swing Mechanics Analysis</CardTitle>
          <CardDescription>Detailed breakdown of your swing components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Backswing Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Backswing Length</span>
                  <span className="font-semibold">{data.swingMetrics.backswingLength}°</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Shoulder Turn</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Optimal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hip Rotation</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Good</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Downswing Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Club Head Speed</span>
                  <span className="font-semibold">{data.swingMetrics.downswingSpeed} mph</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Swing Path</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">On Plane</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Face Angle</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Slightly Open</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Feedback & Recommendations</CardTitle>
          <CardDescription>Personalized tips to improve your swing based on comprehensive analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.feedback.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                {getFeedbackIcon(tip)}
                <div className="flex-1">
                  <p className="text-gray-900">{tip}</p>
                </div>
              </div>
            ))}
            
            {/* Additional specific recommendations */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Wind className="w-4 h-4 mr-2" />
                Ball Flight Recommendations
              </h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your ball spin is {data.ballFlight.spin} RPM - {getSpinDescription(data.ballFlight.spin).desc.toLowerCase()}</li>
                <li>• Launch angle of {data.ballFlight.launch}° is {getLaunchDescription(data.ballFlight.launch).label.toLowerCase()}</li>
                <li>• Ball straightness score suggests {data.ballFlight.straightness >= 85 ? 'excellent' : data.ballFlight.straightness >= 70 ? 'good' : 'room for improvement in'} directional control</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button size="lg" className="px-8">
          <Target className="w-4 h-4 mr-2" />
          Analyze Another Swing
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Progress
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          <RotateCw className="w-4 h-4 mr-2" />
          Compare Swings
        </Button>
      </div>
    </div>
  )
}