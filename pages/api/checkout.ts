// pages/api/checkout.ts

import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment')
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-08-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'prod_SWbCu8j6vIL3Ha', // ⬅️ Replace with a real price ID from Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/`,
    })

    res.status(200).json({ id: session.id })
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}
