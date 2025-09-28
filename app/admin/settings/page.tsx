'use client'

import { useState } from 'react'
import { 
  CogIcon,
  KeyIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  SaveIcon
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'email' | 'video'>('general')
  const [settings, setSettings] = useState({
    // General settings
    appName: 'CrewAI Quiz System',
    timezone: 'UTC',
    language: 'en',
    
    // AI settings
    primaryLLM: 'gemini',
    fallbackLLM: 'groq',
    maxQuestions: 50,
    defaultTimePerQuestion: 60,
    
    // Email settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    fromEmail: 'noreply@example.com',
    emailTemplate: 'default',
    
    // Video settings
    maxVideoDuration: 600, // 10 minutes
    allowedFormats: ['mp4', 'mov', 'avi'],
    transcriptionProvider: 'youtube'
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save settings to backend
      console.log('Saving settings:', settings)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'ai', name: 'AI Settings', icon: AcademicCapIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'video', name: 'Video', icon: VideoCameraIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Name
                  </label>
                  <input
                    type="text"
                    value={settings.appName}
                    onChange={(e) => setSettings({...settings, appName: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="input-field"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary LLM Provider
                  </label>
                  <select
                    value={settings.primaryLLM}
                    onChange={(e) => setSettings({...settings, primaryLLM: e.target.value})}
                    className="input-field"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="groq">Groq (Llama3)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fallback LLM Provider
                  </label>
                  <select
                    value={settings.fallbackLLM}
                    onChange={(e) => setSettings({...settings, fallbackLLM: e.target.value})}
                    className="input-field"
                  >
                    <option value="groq">Groq (Llama3)</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Questions per Quiz
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxQuestions}
                    onChange={(e) => setSettings({...settings, maxQuestions: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Time per Question (seconds)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={settings.defaultTimePerQuestion}
                    onChange={(e) => setSettings({...settings, defaultTimePerQuestion: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">API Keys Required</h4>
                <p className="text-sm text-blue-800">
                  Make sure to configure your API keys in the environment variables:
                </p>
                <ul className="text-sm text-blue-800 mt-2 list-disc list-inside">
                  <li>GOOGLE_API_KEY for Gemini</li>
                  <li>GROQ_API_KEY for Groq</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Email Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <select
                    value={settings.emailTemplate}
                    onChange={(e) => setSettings({...settings, emailTemplate: e.target.value})}
                    className="input-field"
                  >
                    <option value="default">Default</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Email Credentials</h4>
                <p className="text-sm text-yellow-800">
                  Configure SMTP credentials in your environment variables:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                  <li>SMTP_USERNAME</li>
                  <li>SMTP_PASSWORD</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Video Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Video Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="3600"
                    value={settings.maxVideoDuration}
                    onChange={(e) => setSettings({...settings, maxVideoDuration: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Formats
                  </label>
                  <input
                    type="text"
                    value={settings.allowedFormats.join(', ')}
                    onChange={(e) => setSettings({...settings, allowedFormats: e.target.value.split(', ')})}
                    className="input-field"
                    placeholder="mp4, mov, avi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transcription Provider
                  </label>
                  <select
                    value={settings.transcriptionProvider}
                    onChange={(e) => setSettings({...settings, transcriptionProvider: e.target.value})}
                    className="input-field"
                  >
                    <option value="youtube">YouTube API</option>
                    <option value="whisper">OpenAI Whisper</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Video Processing</h4>
                <p className="text-sm text-green-800">
                  Videos are automatically processed for transcription and topic analysis.
                  Make sure to configure YOUTUBE_API_KEY for video processing.
                </p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
