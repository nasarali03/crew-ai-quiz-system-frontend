'use client'

import { useState } from 'react'

interface QuizResult {
  id: string
  studentName: string
  studentEmail: string
  quizTitle: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: string
  completedAt: string
  rank: number
}

export default function ResultsPage() {
  const [selectedQuiz, setSelectedQuiz] = useState('all')
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score')
  const [searchTerm, setSearchTerm] = useState('')

  // Dummy data
  const results: QuizResult[] = [
    {
      id: '1',
      studentName: 'John Doe',
      studentEmail: 'john.doe@example.com',
      quizTitle: 'Python Fundamentals',
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: '12:30',
      completedAt: '2024-01-20T10:30:00Z',
      rank: 1
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      quizTitle: 'Python Fundamentals',
      score: 88,
      totalQuestions: 15,
      correctAnswers: 13,
      timeSpent: '15:45',
      completedAt: '2024-01-20T11:15:00Z',
      rank: 2
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      studentEmail: 'mike.johnson@example.com',
      quizTitle: 'Data Structures',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeSpent: '18:20',
      completedAt: '2024-01-19T14:20:00Z',
      rank: 1
    },
    {
      id: '4',
      studentName: 'Sarah Wilson',
      studentEmail: 'sarah.wilson@example.com',
      quizTitle: 'Python Fundamentals',
      score: 78,
      totalQuestions: 15,
      correctAnswers: 12,
      timeSpent: '20:10',
      completedAt: '2024-01-20T16:45:00Z',
      rank: 3
    },
    {
      id: '5',
      studentName: 'David Brown',
      studentEmail: 'david.brown@example.com',
      quizTitle: 'Web Development',
      score: 90,
      totalQuestions: 18,
      correctAnswers: 16,
      timeSpent: '14:30',
      completedAt: '2024-01-21T09:15:00Z',
      rank: 1
    }
  ]

  const quizzes = ['all', 'Python Fundamentals', 'Data Structures', 'Web Development']

  const filteredResults = results
    .filter(result => {
      const matchesQuiz = selectedQuiz === 'all' || result.quizTitle === selectedQuiz
      const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesQuiz && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'name':
          return a.studentName.localeCompare(b.studentName)
        case 'date':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
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
          <p className="text-3xl font-bold text-blue-600">{results.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">High Performers</h3>
          <p className="text-3xl font-bold text-purple-600">
            {results.filter(r => r.score >= 90).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Improvement</h3>
          <p className="text-3xl font-bold text-orange-600">
            {results.filter(r => r.score < 70).length}
          </p>
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
                  Time
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
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {result.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                        <div className="text-sm text-gray-500">{result.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.quizTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreBgColor(result.score)} ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.correctAnswers}/{result.totalQuestions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.timeSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.completedAt).toLocaleDateString()}
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