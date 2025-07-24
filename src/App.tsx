import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { VideoUpload } from '@/components/VideoUpload'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AnalysisResults } from '@/components/AnalysisResults'
import { ProgressTracking } from '@/components/ProgressTracking'
import { Upload, Play, BarChart3, TrendingUp, Target, Clock } from 'lucide-react'

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

function App() {
  const [currentTab, setCurrentTab] = useState('upload')
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleVideoUpload = (videoUrl: string) => {
    setUploadedVideo(videoUrl)
    setCurrentTab('analyze')
  }

  const handleAnalyze = async () => {
    if (!uploadedVideo) return
    
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AnalysisData = {
        id: Date.now().toString(),
        videoUrl: uploadedVideo,
        timestamp: new Date(),
        scores: {
          tempo: Math.floor(Math.random() * 30) + 70,
          posture: Math.floor(Math.random() * 25) + 75,
          followThrough: Math.floor(Math.random() * 35) + 65,
          ballStriking: Math.floor(Math.random() * 25) + 75,
          swingPlane: Math.floor(Math.random() * 30) + 70,
          clubFace: Math.floor(Math.random() * 35) + 65,
          overall: Math.floor(Math.random() * 20) + 75
        },
        ballFlight: {
          distance: Math.floor(Math.random() * 50) + 200, // 200-250 yards
          accuracy: Math.floor(Math.random() * 30) + 70,   // 70-100%
          spin: Math.floor(Math.random() * 2000) + 2000,   // 2000-4000 RPM
          launch: Math.floor(Math.random() * 8) + 8,       // 8-16 degrees
          straightness: Math.floor(Math.random() * 30) + 70 // 70-100
        },
        swingMetrics: {
          backswingLength: Math.floor(Math.random() * 30) + 90,  // 90-120 degrees
          downswingSpeed: Math.floor(Math.random() * 20) + 85,   // 85-105 mph
          impactPosition: Math.floor(Math.random() * 25) + 75,   // 75-100
          weightTransfer: Math.floor(Math.random() * 30) + 70,   // 70-100
          attackAngle: (Math.random() - 0.5) * 8,                // -4 to +4 degrees
          swingPath: (Math.random() - 0.5) * 6,                  // -3 to +3 degrees
          clubFaceAngle: (Math.random() - 0.5) * 8,              // -4 to +4 degrees
          smashFactor: 1.2 + Math.random() * 0.3                 // 1.2-1.5
        },
        feedback: [
          "Your swing plane is slightly over the ideal line - focus on a more inside takeaway",
          "Excellent ball striking with solid contact at impact",
          "Ball spin rate is optimal for your swing speed - great control",
          "Consider working on weight transfer for more consistent ball flight",
          "Your club face is slightly open at impact - work on rotation through the ball",
          "Launch angle is in the optimal range for maximum distance",
          "Attack angle shows good descending blow - maintain this for iron shots",
          "Swing path is slightly out-to-in - work on swinging more from the inside",
          "Smash factor indicates efficient energy transfer - excellent contact quality",
          "Tempo analysis shows good rhythm - maintain this consistency under pressure"
        ]
      }
      setAnalysisData(mockAnalysis)
      setIsAnalyzing(false)
      setCurrentTab('results')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Golf Swing Analyzer</h1>
                <p className="text-sm text-gray-500">AI-Powered Technique Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Clock className="w-3 h-3 mr-1" />
                Pro Analysis
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-green-200">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center space-x-2" disabled={!uploadedVideo}>
              <Play className="w-4 h-4" />
              <span>Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2" disabled={!analysisData}>
              <BarChart3 className="w-4 h-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <span>Upload Your Golf Swing</span>
                </CardTitle>
                <CardDescription>
                  Upload a video of your golf swing for AI-powered analysis. Best results with side-view recordings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoUpload onVideoUpload={handleVideoUpload} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Preview</CardTitle>
                  <CardDescription>Review your swing before analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadedVideo && <VideoPlayer videoUrl={uploadedVideo} />}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analysis Controls</CardTitle>
                  <CardDescription>Start AI-powered swing analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <h3 className="font-semibold text-lg">Analyzing Your Swing</h3>
                        <p className="text-gray-600">AI is processing your technique...</p>
                      </div>
                      <Progress value={66} className="w-full" />
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>✓ Video processing complete</p>
                        <p>✓ Motion tracking analysis</p>
                        <p className="text-primary">→ Generating feedback...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Ready for Analysis</h3>
                        <p className="text-gray-600">Click below to start AI analysis</p>
                      </div>
                      <Button onClick={handleAnalyze} className="w-full" size="lg">
                        <Play className="w-4 h-4 mr-2" />
                        Analyze Swing
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {analysisData && <AnalysisResults data={analysisData} />}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTracking />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App