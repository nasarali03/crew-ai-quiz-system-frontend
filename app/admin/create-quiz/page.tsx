'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function CreateQuizPage() {
  const [creating, setCreating] = useState(false)
  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<QuizFormData>({
    defaultValues: {
      difficulty: 'medium',
      time_per_question: 60,
      total_questions: 10,
      question_type: 'MCQ'
    }
  })

  // Debug: Log form values
  const watchedValues = watch()
  console.log('Form values:', watchedValues)
  
  // Test if inputs are working
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.name, e.target.value)
  }

  const onSubmit = async (data: QuizFormData) => {
    setCreating(true)
    try {
      console.log('Sending quiz data:', data)
      
      // Create quiz
      const quizResponse = await fetch('/api/admin/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json()
        console.error('Quiz creation error:', errorData)
        throw new Error(`Failed to create quiz: ${errorData.detail || 'Unknown error'}`)
      }

      const quiz = await quizResponse.json()
      toast.success('Quiz created successfully!')

      // Generate questions
      setGeneratingQuestions(true)
      const questionsResponse = await fetch(`/api/admin/quiz/${quiz.id}/generate-questions`, {
        method: 'POST'
      })

      if (!questionsResponse.ok) {
        throw new Error('Failed to generate questions')
      }

      const questionsResult = await questionsResponse.json()
      toast.success('Questions generated successfully!')

      // Redirect to quiz management
      router.push(`/admin/quizzes/${quiz.id}`)

    } catch (error) {
      console.error('Error creating quiz:', error)
      toast.error('Failed to create quiz')
    } finally {
      setCreating(false)
      setGeneratingQuestions(false)
    }
  }

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: 'Basic concepts and definitions' },
    { value: 'medium', label: 'Medium', description: 'Intermediate understanding required' },
    { value: 'hard', label: 'Hard', description: 'Advanced concepts and problem-solving' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
        <p className="text-gray-600">Configure quiz settings and generate AI-powered questions</p>
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
                onChange={handleInputChange}
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

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    {...register('question_type')}
                    type="radio"
                    value="MCQ"
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Multiple Choice Questions (MCQ)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quiz Preview</h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                {watch('title') || 'Quiz Title'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {watch('description') || 'No description provided'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Topic:</span>
                  <p className="text-gray-600">{watch('topic') || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Difficulty:</span>
                  <p className="text-gray-600 capitalize">{watch('difficulty') || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Questions:</span>
                  <p className="text-gray-600">{watch('total_questions') || '0'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Time per Question:</span>
                  <p className="text-gray-600">{watch('time_per_question') || '0'}s</p>
                </div>
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
            disabled={creating || generatingQuestions}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Quiz...
              </>
            ) : generatingQuestions ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Questions...
              </>
            ) : (
              'Create Quiz & Generate Questions'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
