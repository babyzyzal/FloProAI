// pages/login.tsx
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export default function LoginPage() {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Auth supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa }} />
    </div>
  )
}
