"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Pause, SkipForward, Plus, Trash2, LogOut } from "lucide-react"
import { DateTime } from "next-auth/providers/kakao";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function MyStream() {

  const router = useRouter()
  const { data: session } = useSession();

  const [liveSpace, setLiveSpace] = useState<{
    id: string,
    hostId: string,
    isActive: boolean,
    name: string
  } | null>()

  const [streamQueue, setStreamQueue] = useState<{
    title: string,
    artist: string,
    thumbnail: string,
    addedBy: string,
    bigImg: string,
    createAt: DateTime,
    extractedId: string,
    id: string,
    played: string,
    playedTs: null,
    smallImg: string,
    spaceId: string,
    type: "Youtube",
    url: string,
    userId: string
  }[]>(
    //   [
    //   { title: "Blinding Lights", artist: "The Weeknd", votes: 1890, thumbnail: "/placeholder.svg?height=40&width=40" },
    //   { title: "Dance Monkey", artist: "Tones and I", votes: 1654, thumbnail: "/placeholder.svg?height=40&width=40" },
    //   { title: "Watermelon Sugar", artist: "Harry Styles", votes: 1432, thumbnail: "/placeholder.svg?height=40&width=40" },
    //   { title: "Levitating", artist: "Dua Lipa", votes: 1201, thumbnail: "/placeholder.svg?height=40&width=40" },
    //   { title: "Savage Love", artist: "Jason Derulo", votes: 987, thumbnail: "/placeholder.svg?height=40&width=40" },
    // ]
  )

  const [streamTitle, setStreamTitle] = useState("")
  const userEmail = session?.user?.email;
  //@ts-ignore
  const userId = session?.user.id;
  const [songs, setSongs] = useState()
  const [currentSong , setCurrentSong] = useState(null)

  async function addSongToStream() {
    console.log("Creating stream:", streamTitle)
    if (streamTitle == "") {
      alert("Please enter the url")
      return
    }
    console.log(liveSpace?.id)
    const response = await axios.post('/api/streams/addSong', {
      creatorId: userId,
      url: streamTitle,
      spaceId: liveSpace?.id,
      addersId: userId
    })
    if (response.status == 200) {
      alert("Stream Added")
      setStreamTitle("")
    }
    console.log(response.status)
    if (response.status == 201) {
      alert("Song already present in the queue")
    }
    if (response.status == 202) {
      alert("Wrong Url")
    }
    console.log("userId : -", userId, "\n email", userEmail)
    setStreamTitle("")
  }

  async function getStreamSongs(id: string) {
    const response = await axios.get(`/api/streams/getSpaceSongs?streamId=${id}`)
    console.log("This are songs ", response.data.streams)
    // const sortedSongs = response.data.streams.sort((a, b) => b.votes - a.votes);
    setStreamQueue(response.data.streams)
  }

  async function findActiveStream() {
    const response = await axios.get('/api/streams/getLiveSpace')
    if (response.status == 201) {
      alert("No space is live , Start the space to play the songs")
      router.push('/dashboard/createSpace')
      return
    }
    setLiveSpace(response.data.stream)
    getStreamSongs(response.data.stream.id);
  }

  async function stopStreamingStream() {
    const songs = await axios.put('/api/streams/mySpaces', {
      creatorId: userId,
      streamId: liveSpace?.id
    })
    if (songs.status == 200) {
      alert("Stream Ended")
      router.push('/dashboard/createSpace')
    }
  }

  useEffect(() => {
    findActiveStream();
  }, [])

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-gray-100">
      {/* Main Content */}
      <main className="flex-1 w-full p-6 overflow-y-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-8">
          <h1 className="text-3xl font-bold mb-4 lg:mb-0">Streamer Dashboard</h1>
          <Button onClick={stopStreamingStream} variant="ghost" className="text-gray-300 hover:text-white">
            <LogOut className="h-5 w-5 mr-2" />
            End Stream
          </Button>
        </div>

        {/* Live Space */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4"> Space Title <br></br> <div>{liveSpace ? liveSpace.name.toUpperCase() : ""}</div></h2>
        </div>

        {/* Now Playing */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
          <div className="w-full lg:w-[80%] mb-6">
            <iframe
              src="https://www.youtube.com/embed/641_goNZGog"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-[300px] md:h-[400px] rounded-lg"
            ></iframe>
          </div>
          <div className="text-center mb-4">
            <p className="font-medium text-2xl">Shape of You</p>
            <p className="text-gray-400 text-lg">Ed Sheeran</p>
            <div className="flex justify-center space-x-6 mt-5">
              <Button size="icon" variant="outline">
                <Pause className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="outline">
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
          </div>

        </div>

        {/* Song Queue */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Song Queue</h2>
          <div className="flex flex-col md:flex-row mb-4 space-y-4 md:space-y-0 md:space-x-2">
            <Input
              id="streamInput"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="Paste the URL of the song to add to the queue"
              className="flex-grow bg-gray-700 border-gray-600"
            />
            <Button
              onClick={() => {
                addSongToStream();
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>

          </div>

          <ul className="space-y-4">
            {streamQueue == undefined ? <div>
              No Streams in the Queue
            </div> : streamQueue.map((song, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src={song.smallImg} alt={song.title} className="w-10 h-10 rounded object-cover" />
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-16">
                  <span className="text-emerald-500 ">{0} votes</span>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-semibold mb-4">Stream Stats</h2>
        <div className="space-y-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Active Listeners</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Total Votes</p>
            <p className="text-2xl font-bold">5,678</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Song Requests</p>
            <p className="text-2xl font-bold">42</p>
          </div>
        </div>
      </aside>
    </div>
  )
}