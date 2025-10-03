'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminAPI } from '@/lib/api'

interface DashboardStats {
  totalStudents: number
  totalQuizzes: number
  activeQuizzes: number
  completedQuizzes: number
  pendingVideos: number
  processedVideos: number
}

interface RecentActivity {
  id: string
  type: 'quiz_created' | 'student_uploaded' | 'quiz_completed' | 'video_submitted'
  title: string
  timestamp: string
  status: 'success' | 'pending' | 'error'
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>({ name: 'Admin' })
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
    completedQuizzes: 0,
    pendingVideos: 0,
    processedVideos: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch students data
      const studentsResponse = await adminAPI.getStudents()
      const students = studentsResponse.data || []
      
      // Fetch quizzes data
      const quizzesResponse = await adminAPI.getQuizzes()
      const quizzes = quizzesResponse.data || []
      
      // Fetch video submissions
      const videosResponse = await fetch('/api/video/submissions')
      const videos = videosResponse.ok ? await videosResponse.json() : []
      
      // Calculate stats
      const totalStudents = students.length
      const totalQuizzes = quizzes.length
      const activeQuizzes = quizzes.filter((q: any) => q.status === 'active').length
      const completedQuizzes = quizzes.filter((q: any) => q.status === 'completed').length
      const pendingVideos = videos.filter((v: any) => v.status === 'pending').length
      const processedVideos = videos.filter((v: any) => v.status === 'processed').length
      
      setStats({
        totalStudents,
        totalQuizzes,
        activeQuizzes,
        completedQuizzes,
        pendingVideos,
        processedVideos
      })
      
      // Generate recent activity from actual data
      const recentActivity = [
        ...quizzes.slice(0, 2).map((quiz: any, index: number) => ({
          id: `quiz-${quiz.id}`,
          type: 'quiz_created' as const,
          title: quiz.title,
          timestamp: new Date(quiz.created_at).toLocaleString(),
          status: 'success' as const
        })),
        ...students.slice(0, 1).map((student: any, index: number) => ({
          id: `student-${student.id}`,
          type: 'student_uploaded' as const,
          title: `${students.length} students uploaded`,
          timestamp: new Date().toLocaleString(),
          status: 'success' as const
        })),
        ...videos.slice(0, 1).map((video: any, index: number) => ({
          id: `video-${video.id}`,
          type: 'video_submitted' as const,
          title: `${videos.length} video submissions received`,
          timestamp: new Date(video.created_at).toLocaleString(),
          status: video.status === 'processed' ? 'success' as const : 'pending' as const
        }))
      ].slice(0, 4)
      
      setRecentActivity(recentActivity)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to dummy data if API fails
      setStats({
        totalStudents: 0,
        totalQuizzes: 0,
        activeQuizzes: 0,
        completedQuizzes: 0,
        pendingVideos: 0,
        processedVideos: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Welcome back, {admin?.name || 'Admin'}!
        </h1>
        <p className="text-xl text-gray-600">Overview of your quiz system and student activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="card hover-lift group">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl icon-mono icon-primary">👨‍🎓</span>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-gradient">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="card hover-lift group">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl icon-mono icon-success">🧠</span>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">+2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Quizzes</h3>
            <p className="text-4xl font-bold text-gradient">{stats.activeQuizzes}</p>
          </div>
        </div>
        <div className="card hover-lift group">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-purple-50 transition-colors">
                <span className="text-2xl icon-mono icon-primary">📈</span>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">+5</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Quizzes</h3>
            <p className="text-4xl font-bold text-gradient">{stats.completedQuizzes}</p>
          </div>
        </div>
        <div className="card hover-lift group">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-orange-50 transition-colors">
                <span className="text-2xl icon-mono icon-warning">🎬</span>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">-3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Videos</h3>
            <p className="text-4xl font-bold text-gradient">{stats.pendingVideos}</p>
          </div>
        </div>
        <div className="card hover-lift group">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-green-50 transition-colors">
                <span className="text-2xl icon-mono icon-success">✨</span>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">+8</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processed Videos</h3>
            <p className="text-4xl font-bold text-gradient">{stats.processedVideos}</p>
          </div>
        </div>
        <div className="card hover-lift group">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-gray-50 transition-colors">
                <span className="text-2xl icon-mono">📚</span>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">+1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Quizzes</h3>
            <p className="text-4xl font-bold text-gradient">{stats.totalQuizzes}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/upload"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:scale-105 transform group"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                <span className="text-xl icon-mono icon-primary">📤</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Upload Students</h3>
                <p className="text-sm text-gray-600">Import student list from Excel</p>
              </div>
            </Link>
            
            <Link
              href="/admin/create-quiz"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:scale-105 transform group"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                <span className="text-xl icon-mono icon-success">🧠</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create Quiz</h3>
                <p className="text-sm text-gray-600">Generate AI-powered questions</p>
              </div>
            </Link>
            
            <Link
              href="/admin/invitations"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:scale-105 transform group"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                <span className="text-xl icon-mono icon-primary">📨</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Send Invitations</h3>
                <p className="text-sm text-gray-600">Email quiz links to students</p>
              </div>
            </Link>
            
            <Link
              href="/admin/videos"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:scale-105 transform group"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                <span className="text-xl icon-mono icon-warning">🎬</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Process Videos</h3>
                <p className="text-sm text-gray-600">Evaluate student submissions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-green-100 text-green-800' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

