import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as any
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`http://localhost:3000${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(new URL(next, request.url))
      }
    } else {
      // If the token fails (often because Gmail already clicked it in the background),
      // we assume they are confirmed and just ask them to log in.
      return NextResponse.redirect(new URL('/auth?message=Email+verified!+Please+sign+in+now.', request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth?error=Invalid+confirmation+link.', request.url))
}
