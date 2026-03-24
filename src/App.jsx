import { Routes, Route } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <HeartPulse className="w-12 h-12 text-blue-600 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">RambaMedTech</h1>
      <p className="text-gray-500 mt-2">React · Tailwind CSS · React Router · Lucide</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
