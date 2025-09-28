'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '🏠' },
    { name: 'Students', href: '/admin/students', icon: '👨‍🎓' },
    { name: 'Quizzes', href: '/admin/quizzes', icon: '🧠' },
    { name: 'Results', href: '/admin/results', icon: '📈' },
    { name: 'Videos', href: '/admin/videos', icon: '🎬' },
    { name: 'Invitations', href: '/admin/invitations', icon: '📨' },
    { name: 'Settings', href: '/admin/settings', icon: '🔧' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col glass-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gradient">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow glass-card border-r border-white/20">
          <div className="flex h-16 items-center px-6">
            <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-xl">🎓</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gradient">
              Admin Panel
            </span>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-600 hover:bg-white/50 hover:text-gray-800 transition-all duration-300 hover:scale-105 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mr-4 text-xl icon-mono group-hover:icon-primary">{item.icon}</span>
                {item.name}
                <span className="ml-auto transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 glass-card border-b border-gray-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-white/50 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}