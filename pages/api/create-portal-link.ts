// pages/api/create-portal-link.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { customerId } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.origin}/dashboard`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
