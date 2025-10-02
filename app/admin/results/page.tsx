'use client'

import { useState, useEffect } from 'react'

interface QuizResult {
  id: string
  student_name: string
  student_email: string
  quiz_title: string
  percentage: number
  total_questions: number
  total_score: number
  completed_at: string
  rank: number
}

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState('all')
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching quiz results...')
      const response = await fetch('/api/admin/results')
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Retrieved ${data.length} quiz results`)
        setResults(data)
      } else {
        console.error('❌ Failed to fetch results:', response.status, response.statusText)
        setResults([])
      }
    } catch (error) {
      console.error('❌ Error fetching results:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Get unique quizzes from results
  const quizzes = ['all', ...new Set(results.map(r => r.quiz_title))]

  const filteredResults = results
    .filter(result => {
      const matchesQuiz = selectedQuiz === 'all' || result.quiz_title === selectedQuiz
      const matchesSearch = result.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.student_email.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesQuiz && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.percentage - a.percentage
        case 'name':
          return a.student_name.localeCompare(b.student_name)
        case 'date':
          return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        default:
          return 0
      }
    })

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  // Calculate statistics
  const totalSubmissions = results.length
  const averageScore = totalSubmissions > 0 ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalSubmissions) : 0
  const highPerformers = results.filter(r => r.percentage >= 90).length
  const needImprovement = results.filter(r => r.percentage < 70).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
        <p className="text-gray-600">View and analyze student performance across all quizzes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold text-blue-600">{totalSubmissions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">{averageScore}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">High Performers</h3>
          <p className="text-3xl font-bold text-purple-600">{highPerformers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Improvement</h3>
          <p className="text-3xl font-bold text-orange-600">{needImprovement}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="input-field"
            >
              {quizzes.map(quiz => (
                <option key={quiz} value={quiz}>
                  {quiz === 'all' ? 'All Quizzes' : quiz}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Student Results</h2>
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
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correct
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {result.rank === 1 && (
                        <span className="text-yellow-500 mr-2">🥇</span>
                      )}
                      {result.rank === 2 && (
                        <span className="text-gray-400 mr-2">🥈</span>
                      )}
                      {result.rank === 3 && (
                        <span className="text-orange-500 mr-2">🥉</span>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        #{result.rank || index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {result.student_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{result.student_name}</div>
                        <div className="text-sm text-gray-500">{result.student_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.quiz_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreBgColor(result.percentage)} ${getScoreColor(result.percentage)}`}>
                      {result.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.total_score}/{result.total_questions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.completed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No quiz results available yet'}
          </p>
        </div>
      )}
    </div>
  )
}