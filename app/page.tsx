'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('admin')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center animate-fadeInUp">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <h1 className="ml-3 text-3xl font-bold text-gradient">
                CrewAI Quiz System
              </h1>
            </div>
            <div className="flex space-x-3 animate-slideInRight">
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'admin'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                Admin Portal
              </button>
              <button
                onClick={() => setActiveTab('student')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'student'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                Student Portal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'admin' ? (
          <AdminPortal />
        ) : (
          <StudentPortal />
        )}
      </main>
    </div>
  )
}

function AdminPortal() {
  return (
    <div className="space-y-12 animate-fadeInUp">
      <div className="text-center">
        <h2 className="text-5xl font-bold text-gradient mb-6">
          Admin Dashboard
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Manage quizzes, students, and monitor results with automated CrewAI agents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AdminCard
          icon="👨‍🎓"
          title="Student Management"
          description="Upload student lists and manage participants"
          href="/admin/students"
          color="blue"
        />
        <AdminCard
          icon="🧠"
          title="Quiz Creation"
          description="Create quizzes with AI-generated questions"
          href="/admin/quizzes"
          color="green"
        />
        <AdminCard
          icon="📈"
          title="Results & Analytics"
          description="View quiz results and student performance"
          href="/admin/results"
          color="purple"
        />
        <AdminCard
          icon="📨"
          title="Quiz Invitations"
          description="Send personalized quiz invitations"
          href="/admin/invitations"
          color="orange"
        />
        <AdminCard
          icon="🎬"
          title="Video Evaluation"
          description="Monitor video submissions and evaluations"
          href="/admin/videos"
          color="red"
        />
        <AdminCard
          icon="🔧"
          title="System Settings"
          description="Configure agents and system preferences"
          href="/admin/settings"
          color="gray"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/upload"
            className="btn-primary text-center py-3"
          >
            Upload Student List
          </Link>
          <Link
            href="/admin/create-quiz"
            className="btn-secondary text-center py-3"
          >
            Create New Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}

function StudentPortal() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Student Portal
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take quizzes and submit videos for evaluation
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Access Your Quiz
            </h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Enter your quiz token to access your assigned quiz
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter quiz token"
                className="input-field"
              />
              <button className="btn-primary w-full">
                Access Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <StudentCard
          icon="✏️"
          title="Take Quiz"
          description="Complete your assigned quiz with timed questions"
          color="blue"
        />
        <StudentCard
          icon="🎤"
          title="Submit Video"
          description="Upload your video response for evaluation"
          color="green"
        />
      </div>
    </div>
  )
}

function AdminCard({ icon, title, description, href, color }: {
  icon: string
  title: string
  description: string
  href: string
  color: string
}) {
  const colorClasses = {
    blue: 'gradient-secondary',
    green: 'gradient-success',
    purple: 'gradient-primary',
    orange: 'gradient-warning',
    red: 'gradient-danger',
    gray: 'bg-gradient-to-r from-gray-400 to-gray-600',
  }

  return (
    <Link href={href} className="card hover-lift group">
      <div className="card-body">
        <div className="flex items-center mb-6">
          <div className="p-4 bg-gray-100 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:bg-indigo-50">
            <span className="text-3xl icon-mono group-hover:icon-primary">{icon}</span>
          </div>
          <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex items-center text-gray-600 font-semibold group-hover:text-gray-800 transition-colors">
          <span>Get Started</span>
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  )
}

function StudentCard({ icon, title, description, color }: {
  icon: string
  title: string
  description: string
  color: string
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
  }

  return (
    <div className="card hover-lift group">
      <div className="card-body">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <span className="text-2xl icon-mono group-hover:icon-primary">{icon}</span>
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  )
}
