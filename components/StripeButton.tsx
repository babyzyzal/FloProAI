// components/StripeButton.tsx

'use client'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

export default function StripeButton() {
  const handleClick = async () => {
    // Call your API route to create a Checkout Session
    const res = await fetch('/api/checkout', {
      method: 'POST',
    })

    const data = await res.json()

    const stripe = await stripePromise

    // Redirect to Stripe Checkout
    const result = await stripe?.redirectToCheckout({
      sessionId: data.id,
    })

    if (result?.error) {
      alert(result.error.message)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
    >
      Try Demo Checkout
    </button>
  )
}
