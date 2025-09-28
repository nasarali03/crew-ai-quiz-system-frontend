'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  VideoCameraIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface VideoSubmissionForm {
  videoUrl: string
  topic: string
  studentName: string
  studentEmail: string
}

export default function VideoSubmissionPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<VideoSubmissionForm>()

  const videoUrl = watch('videoUrl')

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    return youtubeRegex.test(url)
  }

  const handleUrlChange = (url: string) => {
    if (url) {
      const isValid = validateYouTubeUrl(url)
      setIsValidUrl(isValid)
    } else {
      setIsValidUrl(null)
    }
  }

  const onSubmit = async (data: VideoSubmissionForm) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/video/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_url: data.videoUrl,
          topic: data.topic
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit video')
      }

      const result = await response.json()
      setSubmitted(true)
      toast.success('Video submitted successfully!')

    } catch (error) {
      console.error('Error submitting video:', error)
      toast.error('Failed to submit video')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your video has been submitted for evaluation. You will be notified of the results.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 text-left space-y-1">
              <li>• Your video will be processed and transcribed</li>
              <li>• AI will evaluate topic coverage</li>
              <li>• Results will be ranked with other submissions</li>
              <li>• Top 2 students will be notified as winners</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <VideoCameraIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Submission</h1>
            <p className="text-lg text-gray-600">
              Submit your video response for evaluation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('studentName', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.studentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('studentEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="Enter your email"
                />
                {errors.studentEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.studentEmail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 text-gray-500 mr-1" />
                    Video URL (YouTube) *
                  </div>
                </label>
                <input
                  {...register('videoUrl', { 
                    required: 'Video URL is required',
                    validate: (value) => validateYouTubeUrl(value) || 'Please enter a valid YouTube URL'
                  })}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                  onChange={(e) => {
                    setValue('videoUrl', e.target.value)
                    handleUrlChange(e.target.value)
                  }}
                />
                {errors.videoUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
                )}
                {isValidUrl === true && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Valid YouTube URL
                  </p>
                )}
                {isValidUrl === false && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    Please enter a valid YouTube URL
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  className="input-field"
                  placeholder="Enter the topic you're discussing in the video"
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Video Preview */}
          {videoUrl && isValidUrl && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h2>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PlayIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Video will be processed after submission</p>
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Submission Guidelines</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Video must be uploaded to YouTube and be publicly accessible
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Video should be between 2-10 minutes in length
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Clearly discuss the assigned topic
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Ensure good audio quality for transcription
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Only one submission per student
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !isValidUrl}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
