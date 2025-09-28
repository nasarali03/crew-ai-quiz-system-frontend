'use client'

import { useState } from 'react'

interface TestResult {
  endpoint: string
  status: 'success' | 'error' | 'pending'
  message: string
  data?: any
}

export default function TestAPIPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()
      
      return {
        endpoint,
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Success' : `Error: ${data.detail || 'Unknown error'}`,
        data: response.ok ? data : null
      }
    } catch (error) {
      return {
        endpoint,
        status: 'error',
        message: `Network error: ${error}`,
        data: null
      }
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setResults([])

    const tests = [
      // Health check
      { endpoint: '/api/health', method: 'GET' },
      { endpoint: '/api/', method: 'GET' },
      
      // Admin endpoints (these will fail without auth, but we can test the structure)
      { endpoint: '/api/admin/students', method: 'GET' },
      { endpoint: '/api/admin/quizzes', method: 'GET' },
      
      // Quiz endpoints (these will fail without valid tokens, but we can test the structure)
      { endpoint: '/api/quiz/test-token', method: 'GET' },
      { endpoint: '/api/quiz/test-token/questions', method: 'GET' },
      
      // Video endpoints
      { endpoint: '/api/video/submissions', method: 'GET' },
      
      // Workflow endpoints
      { endpoint: '/api/workflow/automated', method: 'POST' },
    ]

    const testResults: TestResult[] = []
    
    for (const test of tests) {
      const result = await testEndpoint(test.endpoint, test.method)
      testResults.push(result)
      setResults([...testResults])
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setTesting(false)
  }

  const testVideoSubmission = async () => {
    const testData = {
      video_url: 'https://www.youtube.com/watch?v=test',
      topic: 'Test Topic'
    }

    const result = await testEndpoint('/api/video/submit', 'POST', testData)
    setResults(prev => [...prev, result])
  }

  const testQuizCreation = async () => {
    const testData = {
      title: 'Test Quiz',
      description: 'Test Description',
      topic: 'Test Topic',
      time_per_question: 60,
      total_questions: 5
    }

    const result = await testEndpoint('/api/admin/create-quiz', 'POST', testData)
    setResults(prev => [...prev, result])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">API Integration Test</h1>
          <p className="text-gray-600 mb-6">
            This page tests all the backend API endpoints to verify they're working correctly.
          </p>

          <div className="space-y-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={testing}
              className="btn-primary disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Run All Tests'}
            </button>

            <button
              onClick={testVideoSubmission}
              className="btn-secondary ml-4"
            >
              Test Video Submission
            </button>

            <button
              onClick={testQuizCreation}
              className="btn-secondary ml-4"
            >
              Test Quiz Creation
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : result.status === 'error'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{result.endpoint}</h3>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 cursor-pointer">
                        View Response Data
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Expected Results</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Health endpoints should return 200 OK</li>
              <li>• Admin endpoints should return 401 Unauthorized (no auth token)</li>
              <li>• Quiz endpoints should return 404 Not Found (invalid token)</li>
              <li>• Video endpoints should work without authentication</li>
              <li>• Workflow endpoints should return 401 Unauthorized (no auth token)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
