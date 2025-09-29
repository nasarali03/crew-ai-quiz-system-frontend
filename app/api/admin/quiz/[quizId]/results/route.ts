import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params
    
    // Forward the request to the backend
    const backendResponse = await fetch(`http://localhost:8000/api/admin/quiz/${quizId}/results`, {
      method: 'GET',
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      return NextResponse.json(
        { error: 'Backend error', details: errorText },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Get quiz results proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}
