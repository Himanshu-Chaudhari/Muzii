import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, Search, Send } from "lucide-react"

export default function JoinStream() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Summer Vibes Mix</h1>

        {/* Currently Playing */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
          <div className="flex items-center space-x-4">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="Shape of You"
              className="w-30 h-30 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-lg">Shape of You</p>
              <p className="text-gray-400">Ed Sheeran</p>
              <p className="text-sm text-gray-500 mt-2">3:54 / 4:23</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like
            </Button>
          </div>
        </div>

        {/* Song Request */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Request a Song</h2>
          <div className="flex space-x-2">
            <Input placeholder="Search for a song" className="flex-grow bg-gray-700 border-gray-600" />
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Upcoming Songs */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Upcoming Songs</h2>
          <ul className="space-y-4">
            {[
              { title: "Blinding Lights", artist: "The Weeknd", votes: 1890, thumbnail: "/placeholder.svg?height=40&width=40" },
              { title: "Dance Monkey", artist: "Tones and I", votes: 1654, thumbnail: "/placeholder.svg?height=40&width=40" },
              { title: "Watermelon Sugar", artist: "Harry Styles", votes: 1432, thumbnail: "/placeholder.svg?height=40&width=40" },
              { title: "Levitating", artist: "Dua Lipa", votes: 1201, thumbnail: "/placeholder.svg?height=40&width=40" },
              { title: "Savage Love", artist: "Jason Derulo", votes: 987, thumbnail: "/placeholder.svg?height=40&width=40" },
            ].map((song, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">{song.votes} votes</span>
                  <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/20">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}