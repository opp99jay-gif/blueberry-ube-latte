'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0515]">
        <div className="text-white/40 text-sm tracking-widest uppercase">Loading...</div>
      </div>
    }>
      <AuthErrorInner />
    </Suspense>
  )
}

function AuthErrorInner() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Something went wrong'
  const errorCode = searchParams.get('error_code') || ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0515] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
          <div className="text-5xl mb-6">🔗</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            {errorCode === 'otp_expired' ? 'Link Expired' : 'Verification Issue'}
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {errorCode === 'otp_expired' 
              ? 'This confirmation link has expired or was already used. Your account may already be confirmed.'
              : `${error}`}
          </p>
          <p className="text-gray-500 text-xs mb-8">
            If you already confirmed your email, just sign in below.
          </p>
          <a
            href="/auth"
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all text-center"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
