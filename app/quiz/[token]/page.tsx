'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Countdown from 'react-countdown'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  time_per_question: number
  total_questions: number
}

interface Question {
  id: string
  question_text: string
  options: string[]
  time_limit: number
  order: number
}

interface QuizAnswer {
  question_id: string
  answer: string
  time_spent: number
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      fetchQuizData()
    }
  }, [token])

  const fetchQuizData = async () => {
    try {
      // Fetch quiz details
      const quizResponse = await fetch(`/api/quiz/${token}`)
      if (!quizResponse.ok) {
        throw new Error('Quiz not found')
      }
      const quizData = await quizResponse.json()
      setQuiz(quizData)

      // Fetch questions
      const questionsResponse = await fetch(`/api/quiz/${token}/questions`)
      if (!questionsResponse.ok) {
        throw new Error('Questions not found')
      }
      const questionsData = await questionsResponse.json()
      setQuestions(questionsData)
      setTimeLeft(questionsData[0]?.time_limit || 60)

    } catch (error) {
      console.error('Error fetching quiz:', error)
      toast.error('Quiz not found or expired')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(questions[currentQuestionIndex]?.time_limit || 60)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      // Save current answer
      const currentQuestion = questions[currentQuestionIndex]
      const newAnswer: QuizAnswer = {
        question_id: currentQuestion.id,
        answer: selectedAnswer,
        time_spent: (currentQuestion.time_limit - timeLeft)
      }
      
      setAnswers([...answers, newAnswer])
      
      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer('')
        setTimeLeft(questions[currentQuestionIndex + 1]?.time_limit || 60)
      } else {
        // Quiz completed
        setQuizCompleted(true)
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer('')
      setTimeLeft(questions[currentQuestionIndex - 1]?.time_limit || 60)
    }
  }

  const submitQuiz = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/quiz/${token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: answers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const result = await response.json()
      toast.success('Quiz submitted successfully!')
      
      // Redirect to results page
      router.push(`/quiz/${token}/results`)

    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    if (selectedAnswer) {
      handleNextQuestion()
    } else {
      // Auto-select first option if no answer selected
      setSelectedAnswer(questions[currentQuestionIndex]?.options[0] || '')
      handleNextQuestion()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz || !questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Found</h1>
          <p className="text-gray-600">This quiz may have expired or the link is invalid.</p>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quiz Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Topic:</span>
                  <span className="font-medium">{quiz.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium">{quiz.total_questions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time per Question:</span>
                  <span className="font-medium">{quiz.time_per_question}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="font-medium">
                    {Math.floor((quiz.total_questions * quiz.time_per_question) / 60)}m {quiz.total_questions * quiz.time_per_question % 60}s
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="btn-primary w-full"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
          <p className="text-gray-600 mb-6">
            You have answered all {questions.length} questions.
          </p>
          <button
            onClick={submitQuiz}
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-1" />
                <Countdown
                  date={Date.now() + timeLeft * 1000}
                  onComplete={handleTimeUp}
                  renderer={({ seconds }) => (
                    <span className="font-mono">{seconds}s</span>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswer === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswer === option
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`} />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
