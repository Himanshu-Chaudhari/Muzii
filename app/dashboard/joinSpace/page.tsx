
"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Radio, Users, Copy, Check, X } from 'lucide-react'
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function JoinStream() {
  const router = useRouter()
  const session = useSession()
  const [streamId, setStreamId] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleJoinStream = () => {
    if (streamId.trim()) {
      console.log("Joining stream:", streamId)
      // Here you would typically handle the logic to join the stream
      showNotification(`Attempting to join stream with ID: ${streamId}`, 'success')
      setStreamId("")
    }
  }

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id)
      showNotification("Stream ID copied to clipboard", 'success')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const liveStreams = [
    { id: "SUMR2023", title: "Summer Vibes Mix", listeners: 1234 },
    { id: "CHILL101", title: "Chill Lofi Beats", listeners: 987 },
    { id: "ROCK4EVR", title: "Rock Classics", listeners: 2345 },
    { id: "JAZZNT01", title: "Jazz Night", listeners: 567 },
    { id: "EDMPRT23", title: "EDM Party", listeners: 3456 },
  ]

  const filteredStreams = useMemo(() => {
    if (!streamId.trim()) return liveStreams
    const lowercasedInput = streamId.toLowerCase()
    return liveStreams.filter(
      stream => 
        stream.id.toLowerCase().includes(lowercasedInput) ||
        stream.title.toLowerCase().includes(lowercasedInput)
    )
  }, [streamId, liveStreams])

  if(!session.data?.user){
    router.push('/')
    return;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 ">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white flex items-center justify-between`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 focus:outline-none">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Join a Stream</CardTitle>
            <CardDescription className="text-gray-400">Enter a stream ID to join or select from live streams below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter stream ID"
                value={streamId}
                onChange={(e) => setStreamId(e.target.value)}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={handleJoinStream} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Join Stream
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Live Streams</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredStreams.length === liveStreams.length
                ? "Currently active streaming sessions"
                : `Showing ${filteredStreams.length} matching stream${filteredStreams.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {filteredStreams.map((stream) => (
                <div key={stream.id} className="mb-4 p-4 bg-gray-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Radio className="h-8 w-8 text-emerald-500" />
                    <div>
                      <h3 className="font-semibold text-white">{stream.title}</h3>
                      <p className="text-sm text-gray-400">ID: {stream.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{stream.listeners}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white"
                      onClick={() => copyToClipboard(stream.id)}
                    >
                      {copiedId === stream.id ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedId === stream.id ? "Copied" : "Copy ID"}
                    </Button>
                  </div>
                </div>
              ))}
              {filteredStreams.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No matching streams found
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}