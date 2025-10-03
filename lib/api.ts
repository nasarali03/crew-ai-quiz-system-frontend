import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      // Backend not running
      console.error('Backend server is not running. Please start the backend server.')
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', new URLSearchParams({
      username: email,
      password: password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }),

  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),

  getMe: () => api.get('/api/auth/me'),

  googleLogin: (googleToken: string) => 
    api.post('/api/auth/google', { google_token: googleToken }),
}

// Admin API
export const adminAPI = {
  uploadStudents: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/admin/upload-students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getStudents: () => api.get('/api/admin/students'),
  
  createQuiz: (data: any) => api.post('/api/admin/create-quiz', data),
  
  getQuizzes: () => api.get('/api/admin/quizzes'),
  
  generateQuestions: (quizId: string) => 
    api.post(`/api/admin/quiz/${quizId}/generate-questions`),
  
  sendInvitations: (quizId: string) => 
    api.post(`/api/admin/quiz/${quizId}/send-invitations`),
  
  getQuizResults: (quizId: string) => 
    api.get(`/api/admin/quiz/${quizId}/results`),
  
  exportResults: (quizId: string) => 
    api.get(`/api/admin/quiz/${quizId}/export-results`),
}

// Quiz API
export const quizAPI = {
  getQuiz: (token: string) => api.get(`/api/quiz/${token}`),
  
  getQuestions: (token: string) => api.get(`/api/quiz/${token}/questions`),
  
  submitAnswers: (token: string, answers: any[]) => 
    api.post(`/api/quiz/${token}/submit`, { answers }),
  
  getQuizStatus: (token: string) => api.get(`/api/quiz/${token}/status`),
}

// Video API
export const videoAPI = {
  submitVideo: (data: { video_url: string; topic: string }) => 
    api.post('/api/video/submit', data),
  
  getSubmissions: () => api.get('/api/video/submissions'),
  
  getTranscript: (submissionId: string) => 
    api.get(`/api/video/submission/${submissionId}/transcript`),
  
  processVideos: () => api.post('/api/video/process-videos'),
  
  finalRanking: () => api.post('/api/video/final-ranking'),
  
  getRankings: () => api.get('/api/video/rankings'),
}

export default api
