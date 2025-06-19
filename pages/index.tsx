import Head from 'next/head'
import Image from 'next/image'
import StripeButton from '../components/StripeButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center px-4">
      <Head>
        <title>FloPro AI</title>
      </Head>
      <header className="text-center">
        <Image src="/logo.png" alt="FloPro AI Logo" width={120} height={120} />
        <h1 className="text-4xl font-bold mt-4">FloPro AI</h1>
        <p className="text-xl text-gray-600 mt-2">AI-Powered Virtual Assistant for Service Businesses</p>
      </header>
      <main className="mt-8 w-full max-w-md text-center">
        <input type="email" placeholder="Join Beta – Enter your email" className="w-full p-3 border rounded-lg mb-4" />
        <StripeButton />
      </main>
    </div>
  )
}