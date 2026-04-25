'use client'

import { useState, Suspense } from 'react'
import { login, signup, signInWithGoogle } from './actions'
import { useSearchParams } from 'next/navigation'

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
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {message}
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
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-gray-300 ml-1">Phone Number (For Order Updates)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">📱</span>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        required={!isLogin}
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
                Google
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
