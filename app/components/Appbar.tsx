"use client"
import { Radio } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Appbar() {
  const session = useSession()

  // Function to handle smooth scroll to a section
  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })  
    }
  }

  return (
    <div className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-gray-800/50 backdrop-blur-sm fixed w-full z-10">
      <div className="flex items-center justify-center" >
        <Radio className="h-6 w-6 text-emerald-500" />
        <span onClick={() => handleScroll('main')}  className="cursor-pointer ml-2 text-xl font-bold">MixMaster</span>
      </div>
      <div className="ml-auto flex gap-4 sm:gap-6">
        <div 
          className="text-sm font-medium hover:text-emerald-400 transition-colors cursor-pointer"
          onClick={() => handleScroll('features')} 
        >
          Features
        </div>
        <div 
          className="text-sm font-medium hover:text-emerald-400 transition-colors cursor-pointer"
          onClick={() => handleScroll('about')} 
        >
          About
        </div>
        <div
          onClick={() => {
            session.data?.user ? signOut() : signIn()
          }}
          className="cursor-pointer text-sm font-medium hover:text-emerald-400 transition-colors"
        >
          {session.data?.user ? "LogOut" : "Sign In"}
        </div>
      </div>
    </div>
  )
}
