import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Build the redirect URL cleanly
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Success! Token verified, user is now logged in.
      // Redirect to homepage (or wherever `next` points).
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }

    // Token was already used (e.g., Gmail link scanner) or expired.
    // The user's account IS confirmed in Supabase, they just need to sign in.
    redirectTo.pathname = '/auth'
    redirectTo.searchParams.set('message', 'Email verified! Please sign in with your credentials.')
    return NextResponse.redirect(redirectTo)
  }

  // No token_hash or type provided — invalid link
  redirectTo.pathname = '/auth'
  redirectTo.searchParams.set('error', 'Invalid confirmation link.')
  return NextResponse.redirect(redirectTo)
}
