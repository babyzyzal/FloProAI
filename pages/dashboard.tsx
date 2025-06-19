// pages/dashboard.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/') // 🔒 redirect to home or login
        return
      }

      setUser(user)

      const { data: users } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (users?.id) {
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', users.id)
          .single()

        setSub(subs)
      }

      setLoading(false)
    }

    getUserData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user && <p>Email: {user.email}</p>}
      {sub && <p>Plan Status: {sub.status}</p>}
      {sub && <p>Billing Ends: {new Date(sub.current_period_end).toLocaleDateString()}</p>}
    </div>
  )
}
