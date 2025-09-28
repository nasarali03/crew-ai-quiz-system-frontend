'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  AcademicCapIcon, 
  ArrowLeftIcon,
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  total_questions: number
  time_per_question: number
  is_active: boolean
  created_at: string
}

interface QuizResult {
  id: string
  student_name: string
  student_email: string
  total_score: number
  total_questions: number
  percentage: number
  rank: number
  completed_at: string
}

export default function QuizDetailPage() {
  const params = useParams()
  const quizId = params.id as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'questions'>('overview')

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails()
    }
  }, [quizId])

  const fetchQuizDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch quiz details
      const quizResponse = await fetch(`/api/admin/quizzes/${quizId}`)
      if (quizResponse.ok) {
        const quizData = await quizResponse.json()
        setQuiz(quizData)
      } else {
        console.error('Failed to fetch quiz')
        return
      }
      
      // Fetch quiz results
      const resultsResponse = await fetch(`/api/admin/quiz/${quizId}/results`)
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json()
        setResults(resultsData)
      } else {
        console.error('Failed to fetch results')
        setResults([])
      }
      
    } catch (error) {
      console.error('Error fetching quiz details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz not found</h3>
        <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
        <Link href="/admin/quizzes" className="btn-primary">
          Back to Quizzes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quizzes"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary flex items-center">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button className="btn-primary flex items-center">
            <PlayIcon className="h-4 w-4 mr-2" />
            {quiz.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Quiz Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Topic</p>
            <p className="text-lg font-semibold text-gray-900">{quiz.topic}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Difficulty</p>
            <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Questions</p>
            <p className="text-lg font-semibold text-gray-900">{quiz.total_questions}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Time per Question</p>
            <p className="text-lg font-semibold text-gray-900">{quiz.time_per_question}s</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: AcademicCapIcon },
              { id: 'results', name: 'Results', icon: ChartBarIcon },
              { id: 'questions', name: 'Questions', icon: EyeIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Participants</p>
                      <p className="text-2xl font-semibold text-gray-900">{results.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Average Score</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {results.length > 0 ? 
                          Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Time</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {Math.floor((quiz.total_questions * quiz.time_per_question) / 60)}m
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-primary flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Send Invitations
                </button>
                <button className="btn-secondary flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Export Results
                </button>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Quiz Results</h3>
                <button className="btn-secondary">Export CSV</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{result.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{result.student_name}</div>
                            <div className="text-sm text-gray-500">{result.student_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.total_score}/{result.total_questions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                            result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.completed_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {results.length === 0 && (
                <div className="text-center py-12">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
                  <p className="text-gray-600">Students haven't completed this quiz yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Quiz Questions</h3>
                <button className="btn-primary">Regenerate Questions</button>
              </div>
              
              <div className="text-center py-12">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Questions will be generated</h3>
                <p className="text-gray-600">AI will generate {quiz.total_questions} questions about {quiz.topic}.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
