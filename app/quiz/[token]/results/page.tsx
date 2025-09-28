'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ArrowRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

interface QuizResult {
  id: string
  total_score: number
  total_questions: number
  percentage: number
  rank: number
  completed_at: string
  answers: {
    question_text: string
    student_answer: string
    correct_answer: string
    is_correct: boolean
  }[]
}

export default function QuizResultsPage() {
  const params = useParams()
  const token = params.token as string
  
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchQuizResult()
    }
  }, [token])

  const fetchQuizResult = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${token}/results`)
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        console.error('Failed to fetch quiz result')
        setResult(null)
      }
    } catch (error) {
      console.error('Error fetching quiz result:', error)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <TrophyIcon className="h-6 w-6 text-yellow-500" />
    if (rank <= 3) return <TrophyIcon className="h-6 w-6 text-gray-400" />
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Results Not Found</h1>
          <p className="text-gray-600">Quiz results could not be found or may have expired.</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
            <p className="text-lg text-gray-600">Here's how you performed on the quiz</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              {getRankIcon(result.rank)}
              <span className="text-6xl font-bold text-gray-900 ml-2">
                {result.percentage}%
              </span>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {result.percentage >= 80 ? 'Excellent Work!' : 
               result.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              You scored {result.total_score} out of {result.total_questions} questions correctly
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{result.total_score}</p>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <XCircleIcon className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{result.total_questions - result.total_score}</p>
                <p className="text-sm text-gray-600">Incorrect Answers</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <TrophyIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">#{result.rank}</p>
                <p className="text-sm text-gray-600">Your Rank</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h3>
          
          <div className="space-y-6">
            {result.answers.map((answer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h4>
                  <div className="flex items-center">
                    {answer.is_correct ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{answer.question_text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                    <p className={`p-2 rounded ${
                      answer.is_correct 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.student_answer}
                    </p>
                  </div>
                  
                  {!answer.is_correct && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                      <p className="p-2 rounded bg-green-100 text-green-800">
                        {answer.correct_answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
          <p className="text-blue-800 mb-4">
            {result.percentage >= 80 ? 
              'Congratulations! You\'ve qualified for the video submission round. Submit a video about the quiz topic to compete for the top prizes.' :
              'Keep studying and try again! You can retake similar quizzes to improve your understanding.'
            }
          </p>
          
          {result.percentage >= 80 && (
            <Link
              href="/video-submit"
              className="btn-primary inline-flex items-center"
            >
              Submit Video
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="btn-secondary flex items-center"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <button className="btn-primary flex items-center">
            <ClockIcon className="h-4 w-4 mr-2" />
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
