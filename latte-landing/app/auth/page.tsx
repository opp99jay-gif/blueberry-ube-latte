'use client'

import { useState, useEffect, Suspense } from 'react'
import { login, signup, signInWithGoogle } from './actions'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0515]">
        <div className="text-white/40 text-sm tracking-widest uppercase">Loading...</div>
      </div>
    }>
      <AuthPageInner />
    </Suspense>
  )
}

function AuthPageInner() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  const showEmailSent = message && message.includes('Check your email')

  // Auto-detect when user confirms email in another tab and redirect this tab too
  useEffect(() => {
    if (!showEmailSent) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // User confirmed in the other tab — redirect this tab to home
        window.location.href = '/'
      }
    })

    // Also poll every 3 seconds as a fallback
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.location.href = '/'
      }
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [showEmailSent])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0515] p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {showEmailSent ? 'Email Sent!' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {showEmailSent
                ? 'We sent a confirmation link to your inbox'
                : isLogin 
                  ? 'Sign in to access your luxury latte experience' 
                  : 'Join the blueberry-ube latte revolution'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {showEmailSent ? (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" 
                  alt="Email Sent" 
                  className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(147,112,219,0.5)]" 
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Check Your Inbox</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {message}
              </p>
              <p className="text-gray-500 text-xs mb-6">
                This page will automatically redirect once you confirm your email.
              </p>
              <button
                onClick={() => window.location.href = '/auth'}
                className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {message && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400 text-sm">
                  <span>✅</span>
                  <span>{message}</span>
                </div>
              )}

              <form action={isLogin ? login : signup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">📧</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Phone Number <span className="text-gray-500 text-xs">(For Order Updates)</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">📱</span>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-purple-900/20"
                >
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1a1425] px-4 text-gray-500 rounded-full py-1">Or continue with</span>
                </div>
              </div>

              <button
                onClick={() => signInWithGoogle()}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
