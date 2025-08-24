import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/?error=no_code`)
  }

  const supabase = await createClient()

  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(`${requestUrl.origin}/?error=exchange_failed`)
    }

    if (data?.user) {
      return NextResponse.redirect(`${requestUrl.origin}/`)
    }

    return NextResponse.redirect(`${requestUrl.origin}/?error=no_user_data`)
  } catch (err) {
    console.error("Callback exception:", err)
    return NextResponse.redirect(`${requestUrl.origin}/?error=callback_exception`)
  }
}
