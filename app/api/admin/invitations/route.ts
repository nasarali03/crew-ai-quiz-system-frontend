import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Frontend API: Fetching invitations...')
    
    const response = await fetch(`${API_BASE_URL}/api/admin/invitations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ Frontend API: Failed to fetch invitations:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(`✅ Frontend API: Retrieved ${data.length} invitations`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Frontend API: Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quiz_id } = body
    
    if (!quiz_id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 Frontend API: Sending invitations for quiz ${quiz_id}...`)
    
    const response = await fetch(`${API_BASE_URL}/api/admin/quiz/${quiz_id}/send-invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ Frontend API: Failed to send invitations:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to send invitations' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(`✅ Frontend API: Invitations sent successfully`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Frontend API: Error sending invitations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
