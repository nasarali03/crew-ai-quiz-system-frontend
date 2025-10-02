'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

interface QuizQuestion {
  id: string
  question_text: string
  options: string[]
  correct_answer: string
  explanation: string
  question_number: number
}

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)
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
      
      // Fetch quiz results (optional - don't fail if no results exist)
      try {
        const resultsResponse = await fetch(`/api/admin/quiz/${quizId}/results`)
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json()
          setResults(resultsData)
        } else {
          console.log('No quiz results found yet (students haven\'t taken the quiz)')
          setResults([])
        }
      } catch (error) {
        console.log('Results endpoint not available or no results yet')
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

  const handleEditQuiz = () => {
    router.push(`/admin/quizzes/${quizId}/edit`)
  }

  const handleToggleQuizStatus = async () => {
    if (!quiz) return
    
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !quiz.is_active
        })
      })

      if (response.ok) {
        setQuiz(prev => prev ? { ...prev, is_active: !prev.is_active } : null)
        console.log(`Quiz ${quiz.is_active ? 'deactivated' : 'activated'} successfully`)
      } else {
        console.error('Failed to toggle quiz status')
      }
    } catch (error) {
      console.error('Error toggling quiz status:', error)
    }
  }

  const handleSendInvitations = async () => {
    if (!quiz) return
    
    const confirmed = window.confirm(
      `Send quiz invitations to all students for "${quiz.title}"?\n\nThis will send personalized email invitations with unique quiz links.`
    )
    
    if (!confirmed) return
    
    try {
      console.log(`📧 Sending invitations for quiz ${quizId}...`)
      
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quiz_id: quizId }),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Invitations sent successfully:', result)
        
        const message = `Successfully sent ${result.invitations_sent || 0} invitations!`
        if (result.failed_invitations && result.failed_invitations.length > 0) {
          alert(`${message}\n\nFailed to send ${result.failed_invitations.length} invitations.`)
        } else {
          alert(message)
        }
        
        // Navigate to invitations page to see results
        router.push('/admin/invitations')
      } else {
        console.error('❌ Failed to send invitations:', response.status, response.statusText)
        alert('Failed to send invitations. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error sending invitations:', error)
      alert('Error sending invitations. Please try again.')
    }
  }

  const handleExportResults = () => {
    if (results.length === 0) {
      console.log('No results to export')
      return
    }
    
    // Create CSV content
    const csvContent = [
      ['Rank', 'Student Name', 'Email', 'Score', 'Percentage', 'Completed At'],
      ...results.map(result => [
        result.rank,
        result.student_name,
        result.student_email,
        `${result.total_score}/${result.total_questions}`,
        `${result.percentage}%`,
        new Date(result.completed_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-${quizId}-results.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true)
      // Use full questions endpoint to get questions with answers for admin review
      const response = await fetch(`/api/admin/quiz/${quizId}/questions`)
      if (response.ok) {
        const questionsData = await response.json()
        setQuestions(questionsData)
      } else {
        console.error('Failed to fetch questions')
        setQuestions([])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestions([])
    } finally {
      setQuestionsLoading(false)
    }
  }

  const handleRegenerateQuestions = async () => {
    if (!quiz) return
    
    try {
      const response = await fetch(`/api/admin/quiz/${quizId}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          total_questions: quiz.total_questions
        })
      })

      if (response.ok) {
        console.log('Questions regenerated successfully')
        // Refresh questions after regeneration
        await fetchQuestions()
      } else {
        console.error('Failed to regenerate questions')
      }
    } catch (error) {
      console.error('Error regenerating questions:', error)
    }
  }

  const handleTabChange = (tab: 'overview' | 'results' | 'questions') => {
    setActiveTab(tab)
    if (tab === 'questions' && questions.length === 0) {
      fetchQuestions()
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
          <button 
            onClick={handleEditQuiz}
            className="btn-secondary flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button 
            onClick={handleToggleQuizStatus}
            className="btn-primary flex items-center"
          >
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
                onClick={() => handleTabChange(tab.id as any)}
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
                <button 
                  onClick={handleSendInvitations}
                  className="btn-primary flex items-center justify-center"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Send Invitations
                </button>
                <button 
                  onClick={handleExportResults}
                  className="btn-secondary flex items-center justify-center"
                >
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
                <button 
                  onClick={handleExportResults}
                  className="btn-secondary"
                >
                  Export CSV
                </button>
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
                <div className="flex space-x-2">
                  <button 
                    onClick={fetchQuestions}
                    className="btn-secondary"
                    disabled={questionsLoading}
                  >
                    {questionsLoading ? 'Loading...' : 'Refresh Questions'}
                  </button>
                  <button 
                    onClick={handleRegenerateQuestions}
                    className="btn-primary"
                  >
                    Regenerate Questions
                  </button>
                </div>
              </div>
              
              {questionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Loading questions...</span>
                </div>
              ) : questions.length > 0 ? (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Question {question.question_number || index + 1}
                        </h4>
                        <span className="text-sm text-gray-500">
                          ID: {question.id}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-800 text-base leading-relaxed">
                          {question.question_text}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Options:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                option === question.correct_answer
                                  ? 'border-green-500 bg-green-50 text-green-800'
                                  : 'border-gray-200 bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + optionIndex)}. 
                              </span>
                              {option}
                              {option === question.correct_answer && (
                                <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Explanation:</h5>
                        <p className="text-blue-700 text-sm">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600 mb-4">
                    This quiz doesn't have any questions yet. Click "Regenerate Questions" to create them.
                  </p>
                  <button 
                    onClick={handleRegenerateQuestions}
                    className="btn-primary"
                  >
                    Generate Questions Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
