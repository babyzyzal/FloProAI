// pages/api/webhooks.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { buffer } from 'micro'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature']!
  const buf = await buffer(req)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      const { error } = await supabase.from('users').insert([
        {
          email: session.customer_email,
          stripe_customer_id: session.customer,
        },
      ])

      if (error) {
        console.error('Supabase Insert Error (users):', error.message)
      }

      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice

      const { error } = await supabase.from('subscriptions').upsert([
        {
          stripe_sub_id: invoice.subscription,
          status: invoice.status,
          current_period_end: new Date(invoice.lines.data[0].period.end * 1000).toISOString(),
        },
      ])

      if (error) {
        console.error('Supabase Upsert Error (subscriptions):', error.message)
      }

      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      const { error } = await supabase
        .from('subscriptions')
        .update({ status: subscription.status })
        .eq('stripe_sub_id', subscription.id)

      if (error) {
        console.error('Supabase Update Error (subscriptions):', error.message)
      }

      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.status(200).json({ received: true })
}
