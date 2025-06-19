// pages/cancel.tsx
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Canceled</h1>
      <p className="mt-2 text-gray-700">No worries. You can try again anytime.</p>
      <Link href="/" className="text-blue-600 underline mt-4 block">
        Return Home
      </Link>
    </div>
  )
}
