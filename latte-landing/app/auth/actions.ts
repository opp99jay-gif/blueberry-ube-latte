'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/auth?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/auth?message=Check your email to continue the registration process.')
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const getURL = () => {
    return 'https://blueberry-ube-latte.vercel.app/auth/callback'
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getURL(),
    },
  })

  if (error) {
    redirect('/auth?error=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth')
}
