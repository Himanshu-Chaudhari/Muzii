"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkipForward, Plus, Trash2, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { addSongToStream, findActiveStream, stopStreamingStream } from "../lib/myStreamFunctions";
import { LiveSpace, StreamQueue } from "../lib/interfaces";
import YouTubePlayer from 'youtube-player';

export default function MyStream() {
  const router = useRouter()
  const { data: session } = useSession();
  const [liveSpace, setLiveSpace] = useState<LiveSpace>()
  const [streamQueue, setStreamQueue] = useState<StreamQueue[]>([])
  const [streamTitle, setStreamTitle] = useState("")
  const userEmail = session?.user?.email;
  const [currentSong, setCurrentSong] = useState<StreamQueue>()
  //@ts-ignore
  const userId = session?.user.id;
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!videoPlayerRef.current || !currentSong) {
      return;
    }

    let player = YouTubePlayer(videoPlayerRef.current);
    
    // Load and play the video
    player.loadVideoById(currentSong.extractedId);
    player.playVideo();

    // Handle video end
    function eventHandler(event: any) {
      console.log('Player state:', event.data);
      if (event.data === 0) {  // Video ended
        handlePlayNext();
      }
    }

    player.on("stateChange", eventHandler);

    // Cleanup
    return () => {
      player.destroy();
    };
  }, [currentSong]);

  const handlePlayNext = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      if (!streamQueue || streamQueue.length === 0) {
        setCurrentSong(undefined);
        return;
      }

      const nextQueue = [...streamQueue];
      const nextSong = nextQueue.shift();
      
      if (!nextSong) return;

      setCurrentSong(nextSong);
      setStreamQueue(nextQueue);
    } finally {
      setIsTransitioning(false);
    }
  };

  // Initialize first song when queue loads
  useEffect(() => {
    if (streamQueue.length > 0 && !currentSong && !isTransitioning) {
      handlePlayNext();
    }
  }, [streamQueue]);

  // Fetch active stream and queue
  useEffect(() => {
    const fetchStream = async () => {
      await findActiveStream({
        setLiveSpace,
        router,
        setStreamQueue
      });
    };

    if (session?.user) {
      fetchStream();
    }
  }, [session]);

  const handleAddSong = async () => {
    if (!streamTitle.trim()) return;

    await addSongToStream({
      userId,
      streamTitle,
      liveSpace,
      userEmail,
      setStreamTitle
    });

    await findActiveStream({
      setLiveSpace,
      router,
      setStreamQueue
    });
    
    if (!currentSong && !isTransitioning) {
      await handlePlayNext();
    }
  };

  const handleRemoveSong = (songIndex: number) => {
    const newQueue = [...streamQueue];
    newQueue.splice(songIndex, 1);
    setStreamQueue(newQueue);
  };

  if (!session) {
    return <div className="p-4 text-red-500">Session Expired!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Streamer Dashboard</h1>
          <Button 
            onClick={() => stopStreamingStream({userId, liveSpace, router})} 
            variant="ghost" 
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <LogOut className="h-5 w-5 mr-2" />
            End Stream
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Queue Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Song Queue</h2>
                <div className="text-gray-400">
                  Space: {liveSpace ? liveSpace.name.toUpperCase() : "N/A"}
                </div>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {streamQueue && streamQueue.length > 0 ? (
                  streamQueue.map((song, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={song.smallImg} 
                          alt={song.title} 
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium max-w-96">{song.title}</p>
                          <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-emerald-500 font-medium">{song._count.upvotes}</span>
                        <Button
                          onClick={() => handleRemoveSong(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No songs in the queue
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Player Section */}
          <div className="w-full lg:w-2/5 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add Song</h2>
              <div className="flex gap-4">
                <Input
                  id="streamInput"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Paste song URL..."
                  className="flex-grow bg-gray-700 border-gray-700 text-gray-200"
                />
                <Button
                  onClick={handleAddSong}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Now Playing</h2>
              <div className="text-center space-y-6">
                <div 
                  ref={videoPlayerRef}
                  className="w-full aspect-video mx-auto rounded-lg shadow-xl overflow-hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <p className="font-medium text-xl">{currentSong?.title || 'No song playing'}</p>
                  <p className="text-gray-400">{currentSong?.artist}</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handlePlayNext}
                    disabled={isTransitioning}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-700"
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}