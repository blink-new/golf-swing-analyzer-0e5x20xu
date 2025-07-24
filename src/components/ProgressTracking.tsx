import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Calendar, Target, Award, Clock, User } from 'lucide-react'

export function ProgressTracking() {
  // Mock data for progress tracking
  const progressData = [
    { date: '2024-01-01', overall: 65, tempo: 70, posture: 60, followThrough: 65 },
    { date: '2024-01-08', overall: 68, tempo: 72, posture: 65, followThrough: 67 },
    { date: '2024-01-15', overall: 72, tempo: 75, posture: 70, followThrough: 71 },
    { date: '2024-01-22', overall: 75, tempo: 78, posture: 73, followThrough: 74 },
    { date: '2024-01-29', overall: 78, tempo: 80, posture: 76, followThrough: 78 },
    { date: '2024-02-05', overall: 82, tempo: 85, posture: 80, followThrough: 81 },
  ]

  const recentSessions = [
    { id: 1, date: '2024-02-05', score: 82, improvement: '+4', duration: '15 min' },
    { id: 2, date: '2024-01-29', score: 78, improvement: '+3', duration: '12 min' },
    { id: 3, date: '2024-01-22', score: 75, improvement: '+3', duration: '18 min' },
    { id: 4, date: '2024-01-15', score: 72, improvement: '+4', duration: '14 min' },
    { id: 5, date: '2024-01-08', score: 68, improvement: '+3', duration: '16 min' },
  ]

  const achievements = [
    { id: 1, title: 'First Analysis', description: 'Completed your first swing analysis', earned: true, date: '2024-01-01' },
    { id: 2, title: 'Consistent Improver', description: '5 consecutive sessions with improvement', earned: true, date: '2024-01-29' },
    { id: 3, title: 'Tempo Master', description: 'Achieved 80+ tempo score', earned: true, date: '2024-02-05' },
    { id: 4, title: 'Perfect Posture', description: 'Achieved 85+ posture score', earned: false, date: null },
    { id: 5, title: 'Swing Perfectionist', description: 'Achieved 90+ overall score', earned: false, date: null },
  ]

  const currentStats = {
    totalSessions: 15,
    averageScore: 75,
    bestScore: 82,
    improvement: '+17',
    streak: 5
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{currentStats.totalSessions}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{currentStats.averageScore}</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{currentStats.bestScore}</p>
                <p className="text-sm text-gray-600">Best Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{currentStats.improvement}</p>
                <p className="text-sm text-gray-600">Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{currentStats.streak}</p>
                <p className="text-sm text-gray-600">Session Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your swing improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
              <CardDescription>Track individual aspects of your swing</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tempo" stroke="#f59e0b" strokeWidth={2} name="Tempo" />
                  <Line type="monotone" dataKey="posture" stroke="#3b82f6" strokeWidth={2} name="Posture" />
                  <Line type="monotone" dataKey="followThrough" stroke="#ef4444" strokeWidth={2} name="Follow Through" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest swing analysis sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Duration: {session.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {session.improvement}
                      </Badge>
                      <div className="text-right">
                        <p className="text-lg font-bold">{session.score}</p>
                        <p className="text-sm text-gray-600">Score</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Milestones in your golf improvement journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <Award className={`w-5 h-5 ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-yellow-900' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
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
          Start New Analysis
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Practice
        </Button>
      </div>
    </div>
  )
}