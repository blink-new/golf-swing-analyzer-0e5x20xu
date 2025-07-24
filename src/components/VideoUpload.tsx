import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Video, X, CheckCircle } from 'lucide-react'

interface VideoUploadProps {
  onVideoUpload: (videoUrl: string) => void
}

export function VideoUpload({ onVideoUpload }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadedFile(file)
    
    // Simulate upload process
    setTimeout(() => {
      const videoUrl = URL.createObjectURL(file)
      onVideoUpload(videoUrl)
      setIsUploading(false)
    }, 2000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))
    
    if (videoFile) {
      handleFileUpload(videoFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      handleFileUpload(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <Card
          className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Your Golf Swing Video
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your video here, or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-4">
              <span className="bg-gray-100 px-2 py-1 rounded">MP4</span>
              <span className="bg-gray-100 px-2 py-1 rounded">MOV</span>
              <span className="bg-gray-100 px-2 py-1 rounded">AVI</span>
              <span className="bg-gray-100 px-2 py-1 rounded">WebM</span>
            </div>
            <Button variant="outline" className="mt-2">
              <Video className="w-4 h-4 mr-2" />
              Choose Video File
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isUploading ? (
                <span className="text-sm text-primary">Uploading...</span>
              ) : (
                <span className="text-sm text-green-600">Ready for analysis</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">📹 Recording Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Record from the side view (90° angle to your swing)</li>
            <li>• Ensure good lighting and stable camera</li>
            <li>• Capture the full swing from setup to follow-through</li>
            <li>• Keep the golfer centered in the frame</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}