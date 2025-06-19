// pages/dashboard.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login') // 🔐 redirect to login if not authenticated
        return
      }

      setUser(user)

      const { data: userRecord, error: userRecordError } = await supabase
        .from('users')
        .select('id, stripe_customer_id')
        .eq('auth_id', user.id)
        .single()

      if (userRecordError || !userRecord) {
        console.error('No user record found in DB')
        setLoading(false)
        return
      }

      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userRecord.id)
        .single()

      if (subError) {
        console.error('No subscription found:', subError.message)
      }

      setSubscription({ ...sub, stripe_customer_id: userRecord.stripe_customer_id })
      setLoading(false)
    }

    fetchData()
  }, [router])

  if (loading) return <p className="p-6 text-gray-500">Loading dashboard...</p>

  return (
    <div className="p-6">
      {/* Optional Top Nav or Return Button */}
      <div className="mb-4">
        <Link href="/">
          <button className="text-sm text-blue-600 hover:underline">&larr; Back to Home</button>
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h1>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Email:</strong> {user?.email}</p>

        {subscription ? (
          <>
            <p><strong>Status:</strong> {subscription.status}</p>
            <p><strong>Billing Ends:</strong> {new Date(subscription.current_period_end).toLocaleDateString()}</p>

            {/* Manage Billing Button */}
            <button
              onClick={async () => {
                const res = await fetch('/api/create-portal-link', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customerId: subscription.stripe_customer_id }),
                })

                const data = await res.json()
                if (data.url) window.location.href = data.url
                else alert('Unable to open billing portal.')
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Manage Billing
            </button>
          </>
        ) : (
          <p className="text-red-500 mt-2">No active subscription found.</p>
        )}
      </div>
    </div>
  )
}
