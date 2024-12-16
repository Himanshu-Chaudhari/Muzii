"use client"
import { Button } from "@/components/ui/button"
import { Radio, Music, Users, Zap, Facebook, Twitter, Instagram } from "lucide-react"
import  Appbar  from "./Appbar"
import { useRouter } from "next/navigation"
export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Appbar/>
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-16">
        <div id="main" className="min-h-screen flex flex-col justify-center items-center my-auto max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 animate-gradient-x">
            Crowd-Powered Music Streaming
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            MixMaster revolutionizes live music streaming by putting the power in your audience's hands. Create, stream, and let your viewers shape the playlist in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={()=>router.push('/dashboard/createSpace')} className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-300 transform hover:scale-105">
              Start Your Mix
            </Button>
            <Button onClick={()=>router.push('/dashboard/joinSpace')} variant="outline" className="text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-gray-900 transition-colors duration-300 transform hover:scale-105">
              Join Stream 
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="min-h-screen flex flex-col justify-center items-center">
          <div className="w-full max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
            {[
              { icon: Music, title: "Live Streaming", description: "Broadcast your music live to a global audience" },
              { icon: Users, title: "Audience Voting", description: "Let viewers vote on the next track in real-time" },
              { icon: Zap, title: "Dynamic Playlists", description: "Automatically queue top-voted songs" },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-750">
                <div className="bg-emerald-500 p-3 rounded-full">
                  <feature.icon className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-400 text-sm text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="w-full max-w-3xl mx-auto mt-20 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">How MixMaster Works</h2>
            <ol className="space-y-4">
              {[
                "Start your live music stream",
                "Viewers join and vote on songs",
                "Top-voted tracks get added to your queue",
                "Play the crowd's favorites and watch engagement soar!",
              ].map((step, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 text-gray-900 font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      <footer id="about" className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Radio className="h-6 w-6 text-emerald-500 mr-2" />
            <span className="text-xl font-bold text-white">MixMaster</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-4 sm:mt-0 text-sm">
            © 2023 MixMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
