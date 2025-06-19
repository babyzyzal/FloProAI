import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs service key to read full user table
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { user_id } = req.body

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('auth_id', user_id)
      .single()

    if (error || !user?.stripe_customer_id) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${req.headers.origin}/dashboard`,
    })

    res.status(200).json({ url: session.url })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
