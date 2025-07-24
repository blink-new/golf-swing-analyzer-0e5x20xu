import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Volume2, Eye, Target, Activity, Crosshair, Zap } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  showAnalysisOverlay?: boolean
}

export function VideoPlayer({ videoUrl, showAnalysisOverlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showOverlays, setShowOverlays] = useState(true)
  const [overlayType, setOverlayType] = useState<'swing-plane' | 'posture' | 'ball-path' | 'impact-zone'>('swing-plane')

  // Enhanced drawing functions for overlays
  const drawSwingPlaneOverlay = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const swingProgress = (currentTime % 3) / 3 // 3-second swing cycle
    
    // Ideal swing plane (Ben Hogan's plane)
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 4
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(width * 0.15, height * 0.85)
    ctx.lineTo(width * 0.85, height * 0.25)
    ctx.stroke()

    // Current swing plane with realistic deviation
    const backswingPhase = swingProgress < 0.4
    const downswingPhase = swingProgress >= 0.4 && swingProgress < 0.7
    const followThroughPhase = swingProgress >= 0.7
    
    let deviation = 0
    let planeColor = '#22c55e'
    let planeStatus = 'On Plane'
    
    if (backswingPhase) {
      deviation = Math.sin(swingProgress * Math.PI * 5) * 15
      planeColor = deviation > 5 ? '#ef4444' : deviation < -5 ? '#f59e0b' : '#22c55e'
      planeStatus = deviation > 5 ? 'Over Plane' : deviation < -5 ? 'Under Plane' : 'On Plane'
    } else if (downswingPhase) {
      deviation = Math.sin((swingProgress - 0.4) * Math.PI * 8) * 25
      planeColor = deviation > 10 ? '#ef4444' : deviation < -10 ? '#f59e0b' : '#22c55e'
      planeStatus = deviation > 10 ? 'Steep' : deviation < -10 ? 'Shallow' : 'Perfect'
    } else {
      deviation = Math.sin((swingProgress - 0.7) * Math.PI * 3) * 10
      planeColor = '#3b82f6'
      planeStatus = 'Follow Through'
    }
    
    ctx.strokeStyle = planeColor
    ctx.lineWidth = 3
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    ctx.moveTo(width * 0.15, height * 0.85 + deviation)
    ctx.lineTo(width * 0.85, height * 0.25 + deviation)
    ctx.stroke()

    // Club head position with trail
    const clubX = width * (0.15 + swingProgress * 0.7)
    const clubY = height * (0.85 - swingProgress * 0.6) + deviation
    
    // Club head trail
    ctx.strokeStyle = planeColor + '80'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const trailProgress = Math.max(0, swingProgress - i * 0.02)
      const trailX = width * (0.15 + trailProgress * 0.7)
      const trailY = height * (0.85 - trailProgress * 0.6) + deviation * (trailProgress / swingProgress)
      if (i === 0) ctx.moveTo(trailX, trailY)
      else ctx.lineTo(trailX, trailY)
    }
    ctx.stroke()
    
    // Club head
    ctx.fillStyle = planeColor
    ctx.beginPath()
    ctx.arc(clubX, clubY, 10, 0, 2 * Math.PI)
    ctx.fill()
    
    // Club shaft
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(clubX, clubY)
    ctx.lineTo(clubX - 30, clubY + 60)
    ctx.stroke()

    // Labels with background
    const drawLabel = (text: string, x: number, y: number, color: string) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(x - 5, y - 20, text.length * 8 + 10, 25)
      ctx.fillStyle = color
      ctx.font = 'bold 14px Inter'
      ctx.fillText(text, x, y)
    }
    
    drawLabel('Ideal Plane', width * 0.05, height * 0.7, '#22c55e')
    drawLabel(planeStatus, width * 0.05, height * 0.75, planeColor)
    
    // Angle measurement
    const angle = Math.atan2(height * 0.6, width * 0.7) * 180 / Math.PI
    drawLabel(`Plane Angle: ${Math.abs(angle + deviation * 0.5).toFixed(1)}°`, width * 0.05, height * 0.8, '#ffffff')
  }, [currentTime])

  const drawPostureOverlay = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const swingProgress = (currentTime % 3) / 3
    
    // Spine angle with movement
    const spineAngle = 15 + Math.sin(swingProgress * Math.PI * 2) * 5
    const spineX1 = width * 0.45
    const spineY1 = height * 0.2
    const spineX2 = spineX1 + Math.sin(spineAngle * Math.PI / 180) * height * 0.6
    const spineY2 = spineY1 + Math.cos(spineAngle * Math.PI / 180) * height * 0.6
    
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(spineX1, spineY1)
    ctx.lineTo(spineX2, spineY2)
    ctx.stroke()

    // Head position with stability indicator
    const headStability = Math.abs(Math.sin(swingProgress * Math.PI * 4)) * 10
    ctx.strokeStyle = headStability > 5 ? '#ef4444' : '#22c55e'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(width * 0.42 + headStability, height * 0.25, 30, 0, 2 * Math.PI)
    ctx.stroke()
    
    // Head stability indicator
    ctx.fillStyle = headStability > 5 ? '#ef4444' : '#22c55e'
    ctx.beginPath()
    ctx.arc(width * 0.42 + headStability, height * 0.25, 5, 0, 2 * Math.PI)
    ctx.fill()

    // Shoulder rotation
    const shoulderRotation = swingProgress * 90 - 45
    const shoulderLength = width * 0.15
    const shoulderCenterX = width * 0.45
    const shoulderCenterY = height * 0.35
    
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(
      shoulderCenterX - Math.cos(shoulderRotation * Math.PI / 180) * shoulderLength,
      shoulderCenterY - Math.sin(shoulderRotation * Math.PI / 180) * shoulderLength
    )
    ctx.lineTo(
      shoulderCenterX + Math.cos(shoulderRotation * Math.PI / 180) * shoulderLength,
      shoulderCenterY + Math.sin(shoulderRotation * Math.PI / 180) * shoulderLength
    )
    ctx.stroke()

    // Hip rotation (less than shoulders)
    const hipRotation = shoulderRotation * 0.6
    const hipLength = width * 0.12
    const hipCenterX = width * 0.47
    const hipCenterY = height * 0.55
    
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(
      hipCenterX - Math.cos(hipRotation * Math.PI / 180) * hipLength,
      hipCenterY - Math.sin(hipRotation * Math.PI / 180) * hipLength
    )
    ctx.lineTo(
      hipCenterX + Math.cos(hipRotation * Math.PI / 180) * hipLength,
      hipCenterY + Math.sin(hipRotation * Math.PI / 180) * hipLength
    )
    ctx.stroke()

    // Weight distribution
    const weightShift = Math.sin(swingProgress * Math.PI) * 20
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)'
    ctx.beginPath()
    ctx.arc(width * 0.4 + weightShift, height * 0.8, 25, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.beginPath()
    ctx.arc(width * 0.5 - weightShift, height * 0.8, 25, 0, 2 * Math.PI)
    ctx.fill()

    // Labels
    const drawLabel = (text: string, x: number, y: number, color: string) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(x - 5, y - 20, text.length * 7 + 10, 25)
      ctx.fillStyle = color
      ctx.font = 'bold 12px Inter'
      ctx.fillText(text, x, y)
    }
    
    drawLabel(`Spine: ${spineAngle.toFixed(1)}°`, width * 0.6, height * 0.5, '#22c55e')
    drawLabel(headStability > 5 ? 'Head Moving' : 'Head Stable', width * 0.5, height * 0.15, headStability > 5 ? '#ef4444' : '#22c55e')
    drawLabel(`Shoulder: ${shoulderRotation.toFixed(0)}°`, width * 0.65, height * 0.35, '#3b82f6')
    drawLabel(`Hip: ${hipRotation.toFixed(0)}°`, width * 0.65, height * 0.55, '#8b5cf6')
  }, [currentTime])

  const drawBallPathOverlay = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const swingProgress = (currentTime % 3) / 3
    const ballStartX = width * 0.5
    const ballStartY = height * 0.7

    // Ball at address
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(ballStartX, ballStartY, 8, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Impact zone
    if (swingProgress > 0.45 && swingProgress < 0.55) {
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(ballStartX, ballStartY, 30, 0, 2 * Math.PI)
      ctx.stroke()
      
      // Impact flash
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)'
      ctx.beginPath()
      ctx.arc(ballStartX, ballStartY, 25, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Ball flight path (after impact)
    if (swingProgress > 0.5) {
      const flightProgress = (swingProgress - 0.5) * 2
      const ballFlightX = ballStartX + flightProgress * width * 0.4
      const ballFlightY = ballStartY - flightProgress * height * 0.3 + Math.sin(flightProgress * Math.PI) * 30
      
      // Ball in flight
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(ballFlightX, ballFlightY, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
      
      // Flight trail
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'
      ctx.lineWidth = 3
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(ballStartX, ballStartY)
      
      for (let i = 0; i <= flightProgress * 100; i++) {
        const progress = i / 100
        const x = ballStartX + progress * width * 0.4
        const y = ballStartY - progress * height * 0.3 + Math.sin(progress * Math.PI) * 30
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Target line
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.setLineDash([15, 5])
    ctx.beginPath()
    ctx.moveTo(ballStartX, ballStartY)
    ctx.lineTo(width * 0.9, ballStartY - height * 0.25)
    ctx.stroke()

    // Wind indicator
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    for (let i = 0; i < 5; i++) {
      const windX = width * 0.8 + i * 15
      const windY = height * 0.2 + Math.sin(currentTime * 2 + i) * 5
      ctx.beginPath()
      ctx.moveTo(windX, windY)
      ctx.lineTo(windX + 10, windY)
      ctx.stroke()
    }

    // Labels
    const drawLabel = (text: string, x: number, y: number, color: string) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(x - 5, y - 20, text.length * 7 + 10, 25)
      ctx.fillStyle = color
      ctx.font = 'bold 12px Inter'
      ctx.fillText(text, x, y)
    }
    
    drawLabel('Ball Position', ballStartX - 40, ballStartY + 30, '#ffffff')
    drawLabel('Target Line', width * 0.7, height * 0.4, '#ef4444')
    drawLabel('Wind →', width * 0.75, height * 0.15, '#6b7280')
    
    if (swingProgress > 0.5) {
      const distance = ((swingProgress - 0.5) * 280).toFixed(0)
      drawLabel(`${distance} yards`, width * 0.7, height * 0.6, '#22c55e')
    }
  }, [currentTime])

  const drawImpactZoneOverlay = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const swingProgress = (currentTime % 3) / 3
    const impactX = width * 0.5
    const impactY = height * 0.7
    
    // Impact zone circle
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 4
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(impactX, impactY, 40, 0, 2 * Math.PI)
    ctx.stroke()
    
    // Sweet spot
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(impactX, impactY, 8, 0, 2 * Math.PI)
    ctx.fill()
    
    // Club face angle at impact
    const clubFaceAngle = Math.sin(swingProgress * Math.PI * 2) * 15
    const clubFaceLength = 60
    
    ctx.strokeStyle = Math.abs(clubFaceAngle) > 5 ? '#ef4444' : '#22c55e'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(
      impactX - Math.cos((90 + clubFaceAngle) * Math.PI / 180) * clubFaceLength / 2,
      impactY - Math.sin((90 + clubFaceAngle) * Math.PI / 180) * clubFaceLength / 2
    )
    ctx.lineTo(
      impactX + Math.cos((90 + clubFaceAngle) * Math.PI / 180) * clubFaceLength / 2,
      impactY + Math.sin((90 + clubFaceAngle) * Math.PI / 180) * clubFaceLength / 2
    )
    ctx.stroke()
    
    // Attack angle indicator
    const attackAngle = Math.sin(swingProgress * Math.PI) * 10 - 2
    ctx.strokeStyle = attackAngle > 0 ? '#ef4444' : '#22c55e'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(impactX - 50, impactY)
    ctx.lineTo(impactX + 50, impactY + attackAngle * 2)
    ctx.stroke()
    
    // Divot pattern
    if (swingProgress > 0.48 && swingProgress < 0.52) {
      ctx.fillStyle = 'rgba(139, 69, 19, 0.6)'
      ctx.beginPath()
      ctx.ellipse(impactX + 20, impactY + 10, 30, 8, 0, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Impact metrics display
    const drawMetric = (label: string, value: string, x: number, y: number, color: string) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(x - 5, y - 35, 120, 40)
      ctx.fillStyle = color
      ctx.font = 'bold 11px Inter'
      ctx.fillText(label, x, y - 15)
      ctx.font = 'bold 14px Inter'
      ctx.fillText(value, x, y)
    }
    
    drawMetric('Club Face', `${clubFaceAngle.toFixed(1)}° ${clubFaceAngle > 0 ? 'Open' : 'Closed'}`, width * 0.05, height * 0.3, Math.abs(clubFaceAngle) > 5 ? '#ef4444' : '#22c55e')
    drawMetric('Attack Angle', `${attackAngle.toFixed(1)}°`, width * 0.05, height * 0.4, attackAngle > 0 ? '#ef4444' : '#22c55e')
    drawMetric('Impact Location', 'Sweet Spot', width * 0.05, height * 0.5, '#22c55e')
    
    // Ball compression visualization
    if (swingProgress > 0.49 && swingProgress < 0.51) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.8)'
      ctx.beginPath()
      ctx.ellipse(impactX, impactY, 12, 6, 0, 0, 2 * Math.PI)
      ctx.fill()
    }
  }, [currentTime])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  // Draw analysis overlays on canvas
  useEffect(() => {
    if (!showAnalysisOverlay || !showOverlays) return

    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawOverlays = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Set canvas size to match video
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360

      const width = canvas.width
      const height = canvas.height

      // Draw different overlay types
      if (overlayType === 'swing-plane') {
        drawSwingPlaneOverlay(ctx, width, height)
      } else if (overlayType === 'posture') {
        drawPostureOverlay(ctx, width, height)
      } else if (overlayType === 'ball-path') {
        drawBallPathOverlay(ctx, width, height)
      } else if (overlayType === 'impact-zone') {
        drawImpactZoneOverlay(ctx, width, height)
      }
    }

    const animationFrame = requestAnimationFrame(drawOverlays)
    return () => cancelAnimationFrame(animationFrame)
  }, [showAnalysisOverlay, showOverlays, overlayType, currentTime, drawSwingPlaneOverlay, drawPostureOverlay, drawBallPathOverlay, drawImpactZoneOverlay])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.volume = value[0]
    setVolume(value[0])
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          onClick={togglePlay}
        />
        
        {/* Analysis Overlay Canvas */}
        {showAnalysisOverlay && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: 'normal' }}
          />
        )}
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              size="lg"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black"
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Analysis Controls Overlay */}
        {showAnalysisOverlay && (
          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex items-center space-x-2 bg-black/70 rounded-lg px-3 py-2">
              <Eye className="w-4 h-4 text-white" />
              <Switch
                checked={showOverlays}
                onCheckedChange={setShowOverlays}
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-white text-sm">Overlays</span>
            </div>
            
            {showOverlays && (
              <div className="space-y-1">
                <Button
                  variant={overlayType === 'swing-plane' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setOverlayType('swing-plane')}
                  className="w-full text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  Swing Plane
                </Button>
                <Button
                  variant={overlayType === 'posture' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setOverlayType('posture')}
                  className="w-full text-xs"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Posture
                </Button>
                <Button
                  variant={overlayType === 'ball-path' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setOverlayType('ball-path')}
                  className="w-full text-xs"
                >
                  <Crosshair className="w-3 h-3 mr-1" />
                  Ball Flight
                </Button>
                <Button
                  variant={overlayType === 'impact-zone' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setOverlayType('impact-zone')}
                  className="w-full text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Impact Zone
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => skipTime(-5)}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => skipTime(5)}>
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const video = videoRef.current
                if (video) {
                  video.currentTime = 0
                  setCurrentTime(0)
                }
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            {/* Playback Speed */}
            <div className="flex items-center space-x-1">
              {[0.25, 0.5, 1, 1.5, 2].map((rate) => (
                <Button
                  key={rate}
                  variant={playbackRate === rate ? "default" : "outline"}
                  size="sm"
                  onClick={() => changePlaybackRate(rate)}
                  className="text-xs px-2 py-1 h-7"
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Status */}
        {showAnalysisOverlay && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Target className="w-3 h-3 mr-1" />
                Analysis Active
              </Badge>
              <Badge variant="outline">
                {overlayType === 'swing-plane' && 'Swing Plane Analysis'}
                {overlayType === 'posture' && 'Posture Analysis'}
                {overlayType === 'ball-path' && 'Ball Flight Analysis'}
                {overlayType === 'impact-zone' && 'Impact Zone Analysis'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}