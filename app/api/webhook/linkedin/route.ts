import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Log the entire payload for inspection
    console.log("LinkedIn Webhook Payload:", JSON.stringify(body, null, 2))
    
    // Log headers if needed
    console.log("Headers:", Object.fromEntries(req.headers))
    
    return NextResponse.json({ message: "Webhook received" }, { status: 200 })
  } catch (error) {
    console.error("Webhook Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 