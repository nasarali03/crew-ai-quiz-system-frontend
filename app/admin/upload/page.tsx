'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface UploadedStudent {
  id: string
  name: string
  email: string
  student_id?: string
  data?: string
  extra_info?: string
}

export default function UploadStudentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedStudents, setUploadedStudents] = useState<UploadedStudent[]>([])
  const [preview, setPreview] = useState<any[]>([])
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      // Preview the file content
      previewFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

  const previewFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // This would normally parse the Excel file
      // For demo purposes, we'll show mock data
      setPreview([
        { 
          name: 'John Doe', 
          email: 'john@example.com', 
          student_id: 'STU001',
          data: 'Computer Science Major',
          extra_info: 'Computer Science' 
        },
        { 
          name: 'Jane Smith', 
          email: 'jane@example.com', 
          student_id: 'STU002',
          data: 'Mathematics Major',
          extra_info: 'Mathematics' 
        },
        { 
          name: 'Bob Johnson', 
          email: 'bob@example.com', 
          student_id: 'STU003',
          data: 'Physics Major',
          extra_info: 'Physics' 
        }
      ])
    }
    reader.readAsArrayBuffer(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-students', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Upload failed')
        } else {
          const errorText = await response.text()
          console.error('Non-JSON response:', errorText)
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
      }

      const result = await response.json()
      setUploadedStudents(result.students)
      toast.success(result.message)
      
      // Redirect to students page after successful upload
      setTimeout(() => {
        router.push('/admin/students')
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload students: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Students</h1>
          <p className="text-gray-600">Import student list from Excel file</p>
        </div>
        <a
          href="/student-template.xlsx"
          download
          className="btn-secondary"
        >
          Download Template
        </a>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upload Excel File</h2>
          <p className="text-sm text-gray-600">
            Upload an Excel file with student information. Required columns: name, email
          </p>
        </div>
        
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900">
                {file ? file.name : 'Drag and drop your Excel file here'}
              </p>
              <p className="text-gray-600">
                or click to browse files
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls files
              </p>
            </div>
          </div>

          {file && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {file && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                'Upload Students'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <p className="text-sm text-gray-600">
              {preview.length} students will be imported
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extra Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.student_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.data || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.extra_info || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadedStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Upload Successful</h2>
            </div>
            <p className="text-sm text-gray-600">
              {uploadedStudents.length} students have been imported successfully
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  {student.extra_info && (
                    <p className="text-sm text-gray-500">{student.extra_info}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">Excel File Requirements</h3>
            <div className="mt-2 text-sm text-blue-800">
              <ul className="list-disc list-inside space-y-1">
                <li>File must be in .xlsx or .xls format</li>
                <li>Required columns: <strong>name</strong>, <strong>email</strong></li>
                <li>Optional columns: <strong>student_id</strong>, <strong>data</strong>, <strong>extra_info</strong></li>
                <li>First row should contain column headers</li>
                <li>Maximum 1000 students per upload</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
