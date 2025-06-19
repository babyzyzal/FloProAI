import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (data?.user) {
      // Save to users table
      await supabase.from('users').upsert({
        auth_id: data.user.id,
        email: data.user.email,
      })
    }

    if (error) {
      console.error(error.message)
    }
  }

  return (
    <div className="p-4">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  )
}
