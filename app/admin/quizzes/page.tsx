'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  total_questions: number
  time_per_question: number
  question_type: string
  is_active: boolean
  created_at: string
  admin_id: string
}

export default function QuizzesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'draft'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/quizzes')
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data)
      } else {
        console.error('Failed to fetch quizzes')
        setQuizzes([])
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
    // For now, treat all quizzes as 'active' since we don't have status field
    const matchesFilter = activeTab === 'all' || activeTab === 'active'
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600">Create and manage your quiz assessments</p>
        </div>
        <Link
          href="/admin/create-quiz"
          className="btn-primary"
        >
          Create Quiz
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Quizzes</h3>
          <p className="text-3xl font-bold text-blue-600">{quizzes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Quizzes</h3>
          <p className="text-3xl font-bold text-green-600">
            {quizzes.filter(q => q.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Questions</h3>
          <p className="text-3xl font-bold text-purple-600">
            {quizzes.reduce((sum, q) => sum + q.total_questions, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Topics</h3>
          <p className="text-3xl font-bold text-gray-600">
            {new Set(quizzes.map(q => q.topic)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Completed' },
              { key: 'draft', label: 'Draft' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quiz.is_active)}`}>
                  {quiz.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{quiz.description || 'No description'}</p>
              <p className="text-sm text-gray-500 mb-4">Topic: {quiz.topic}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="text-lg font-semibold text-gray-900">{quiz.total_questions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time per Question</p>
                  <p className="text-lg font-semibold text-gray-900">{quiz.time_per_question}s</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Difficulty</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm text-gray-900">{new Date(quiz.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/quizzes/${quiz.id}`}
                  className="flex-1 btn-primary text-center py-2"
                >
                  View Details
                </Link>
                <Link
                  href={`/admin/quizzes/${quiz.id}/edit`}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first quiz to get started'}
          </p>
          <Link href="/admin/create-quiz" className="btn-primary">
            Create Quiz
          </Link>
        </div>
      )}
    </div>
  )
}