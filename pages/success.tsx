// pages/success.tsx
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600">🎉 Payment Success</h1>
      <p className="mt-2 text-gray-700">You're now subscribed to FlowPro AI.</p>
      <Link href="/dashboard" className="text-blue-600 underline mt-4 block">
        Go to Dashboard
      </Link>
    </div>
  )
}
