import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Frontend API: Fetching quiz results...')
    
    const response = await fetch(`${API_BASE_URL}/api/admin/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ Frontend API: Failed to fetch results:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch quiz results' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(`✅ Frontend API: Retrieved ${data.length} quiz results`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Frontend API: Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
