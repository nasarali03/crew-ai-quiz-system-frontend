import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invitationId = params.id
    
    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 Frontend API: Resending invitation ${invitationId}...`)
    
    const response = await fetch(`${API_BASE_URL}/api/admin/invitations/${invitationId}/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ Frontend API: Failed to resend invitation:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to resend invitation' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(`✅ Frontend API: Invitation resent successfully`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Frontend API: Error resending invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
