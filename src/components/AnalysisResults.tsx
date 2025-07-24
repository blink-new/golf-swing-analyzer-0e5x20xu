import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from './VideoPlayer'
import { 
  Target, 
  Clock, 
  User, 
  TrendingUp, 
  Download, 
  Share2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface AnalysisData {
  id: string
  videoUrl: string
  timestamp: Date
  scores: {
    tempo: number
    posture: number
    followThrough: number
    overall: number
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Swing Analysis Results</span>
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
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Tempo</span>
                  <span className={`text-sm font-semibold ${getScoreColor(data.scores.tempo)}`}>
                    {data.scores.tempo}/100
                  </span>
                </div>
                <Progress value={data.scores.tempo} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Posture</span>
                  <span className={`text-sm font-semibold ${getScoreColor(data.scores.posture)}`}>
                    {data.scores.posture}/100
                  </span>
                </div>
                <Progress value={data.scores.posture} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Follow Through</span>
                  <span className={`text-sm font-semibold ${getScoreColor(data.scores.followThrough)}`}>
                    {data.scores.followThrough}/100
                  </span>
                </div>
                <Progress value={data.scores.followThrough} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyzed Video</CardTitle>
            <CardDescription>Your swing with AI analysis overlay</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoPlayer videoUrl={data.videoUrl} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
            <CardDescription>Key metrics from your swing analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{data.scores.tempo}</div>
                <div className="text-sm text-gray-600">Tempo Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <User className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{data.scores.posture}</div>
                <div className="text-sm text-gray-600">Posture Score</div>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{data.scores.followThrough}</div>
              <div className="text-sm text-gray-600">Follow Through Score</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Feedback</CardTitle>
          <CardDescription>Personalized tips to improve your swing</CardDescription>
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
      </div>
    </div>
  )
}