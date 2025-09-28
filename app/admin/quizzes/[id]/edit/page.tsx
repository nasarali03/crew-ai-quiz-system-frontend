'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { 
  AcademicCapIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface QuizFormData {
  title: string
  description: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  time_per_question: number
  total_questions: number
  question_type: 'MCQ'
}

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  time_per_question: number
  total_questions: number
  question_type: string
  is_active: boolean
  created_at: string
}

export default function EditQuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<QuizFormData>({
    defaultValues: {
      difficulty: 'medium',
      time_per_question: 60,
      total_questions: 10,
      question_type: 'MCQ'
    }
  })

  useEffect(() => {
    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/quizzes/${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data)
        
        // Populate form with quiz data
        setValue('title', data.title)
        setValue('description', data.description || '')
        setValue('topic', data.topic)
        setValue('difficulty', data.difficulty)
        setValue('time_per_question', data.time_per_question)
        setValue('total_questions', data.total_questions)
        setValue('question_type', data.question_type)
      } else {
        toast.error('Failed to fetch quiz')
        router.push('/admin/quizzes')
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
      toast.error('Failed to fetch quiz')
      router.push('/admin/quizzes')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: QuizFormData) => {
    setSaving(true)
    try {
      console.log('Updating quiz with data:', data)
      
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update quiz')
      }

      toast.success('Quiz updated successfully!')
      router.push(`/admin/quizzes/${quizId}`)

    } catch (error: any) {
      console.error('Error updating quiz:', error)
      toast.error(`Failed to update quiz: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: 'Basic concepts and definitions' },
    { value: 'medium', label: 'Medium', description: 'Intermediate understanding required' },
    { value: 'hard', label: 'Hard', description: 'Advanced concepts and problem-solving' }
  ]

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz not found</h3>
        <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/admin/quizzes')}
          className="btn-primary"
        >
          Back to Quizzes
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
          <p className="text-gray-600">Update quiz settings and configuration</p>
        </div>
        <button
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="e.g., Python Fundamentals Quiz"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Optional description of the quiz..."
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                {...register('topic', { required: 'Topic is required' })}
                className="input-field"
                placeholder="e.g., Python Programming, Data Structures, Machine Learning"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
              {errors.topic && (
                <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Configuration */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Quiz Configuration</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficultyOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                      watch('difficulty') === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      {...register('difficulty')}
                      type="radio"
                      value={option.value}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        watch('difficulty') === option.value
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`} />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Time and Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                    Time per Question (seconds) *
                  </div>
                </label>
                <input
                  {...register('time_per_question', { 
                    required: 'Time per question is required',
                    min: { value: 10, message: 'Minimum 10 seconds' },
                    max: { value: 300, message: 'Maximum 300 seconds' }
                  })}
                  type="number"
                  min="10"
                  max="300"
                  className="input-field"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
                {errors.time_per_question && (
                  <p className="mt-1 text-sm text-red-600">{errors.time_per_question.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 mr-1" />
                    Number of Questions *
                  </div>
                </label>
                <input
                  {...register('total_questions', { 
                    required: 'Number of questions is required',
                    min: { value: 1, message: 'Minimum 1 question' },
                    max: { value: 50, message: 'Maximum 50 questions' }
                  })}
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
                {errors.total_questions && (
                  <p className="mt-1 text-sm text-red-600">{errors.total_questions.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
