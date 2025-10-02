'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  AcademicCapIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface QuizInvitation {
  id: string
  quiz_title: string
  student_name: string
  student_email: string
  token: string
  is_used: boolean
  sent_at: string
  quiz_link: string
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<QuizInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all')

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching invitations...')
      const response = await fetch('/api/admin/invitations')
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Retrieved ${data.length} invitations`)
        setInvitations(data)
      } else {
        console.error('❌ Failed to fetch invitations:', response.status, response.statusText)
        setInvitations([])
      }
    } catch (error) {
      console.error('❌ Error fetching invitations:', error)
      setInvitations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = 
      invitation.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.quiz_title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesQuiz = selectedQuiz === 'all' || invitation.quiz_title === selectedQuiz
    
    return matchesSearch && matchesQuiz
  })

  const uniqueQuizzes = [...new Set(invitations.map(i => i.quiz_title))]

  const sendNewInvitations = async () => {
    try {
      // For now, we'll show an alert. In a real implementation, 
      // you'd want to show a modal to select which quiz to send invitations for
      const quizId = prompt('Enter Quiz ID to send invitations for:')
      if (!quizId) return
      
      console.log(`📧 Sending invitations for quiz ${quizId}...`)
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quiz_id: quizId }),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Invitations sent successfully:', result)
        alert(`Successfully sent ${result.invitations_sent || 0} invitations!`)
        // Refresh the invitations list
        fetchInvitations()
      } else {
        console.error('❌ Failed to send invitations:', response.status, response.statusText)
        alert('Failed to send invitations. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error sending invitations:', error)
      alert('Error sending invitations. Please try again.')
    }
  }

  const resendInvitation = async (invitationId: string) => {
    try {
      console.log(`📧 Resending invitation ${invitationId}...`)
      const response = await fetch(`/api/admin/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Invitation resent successfully:', result)
        alert('Invitation resent successfully!')
        // Refresh the invitations list
        fetchInvitations()
      } else {
        console.error('❌ Failed to resend invitation:', response.status, response.statusText)
        alert('Failed to resend invitation. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error resending invitation:', error)
      alert('Error resending invitation. Please try again.')
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Invitations</h1>
          <p className="text-gray-600">Manage and track quiz invitations sent to students</p>
        </div>
        <button 
          onClick={sendNewInvitations}
          className="btn-primary flex items-center"
        >
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          Send New Invitations
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-semibold text-gray-900">{invitations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Used</p>
              <p className="text-2xl font-semibold text-gray-900">
                {invitations.filter(i => i.is_used).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {invitations.filter(i => !i.is_used).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(invitations.map(i => i.student_email)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students or quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Quizzes</option>
                {uniqueQuizzes.map(quiz => (
                  <option key={quiz} value={quiz}>{quiz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Invitations Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {invitation.student_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {invitation.student_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invitation.student_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invitation.quiz_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {invitation.token}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invitation.is_used 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invitation.is_used ? 'Used' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invitation.sent_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <a
                        href={invitation.quiz_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <AcademicCapIcon className="h-4 w-4" />
                      </a>
                      <button 
                        onClick={() => resendInvitation(invitation.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Resend invitation"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvitations.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedQuiz !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No quiz invitations have been sent yet'
              }
            </p>
            {!searchTerm && selectedQuiz === 'all' && (
              <Link href="/admin/quizzes" className="btn-primary">
                Create Quiz
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
