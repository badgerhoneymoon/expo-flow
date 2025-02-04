import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log to Vercel
    console.log('📱 [VoiceRecorder Debug]', {
      action: body.action,
      data: body.data,
      userAgent: body.userAgent,
      timestamp: body.timestamp
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log debug info:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
} 