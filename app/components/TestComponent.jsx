"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Pause, SkipForward, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MyStream() {
  const router = useRouter();
  const { data: session } = useSession();

  const [liveSpace, setLiveSpace] = useState(null);
  const [streamQueue, setStreamQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  const userEmail = session?.user?.email;
  const userId = session?.user?.id;

  // Initialize YouTube IFrame API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      } else {
        initializePlayer();
      }
    };

    window.onYouTubeIframeAPIReady = initializePlayer;

    function initializePlayer() {
      playerRef.current = new YT.Player("youtube-player", {
        height: "400",
        width: "100%",
        videoId: streamQueue[currentSongIndex]?.extractedId || "",
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: onPlayerStateChange,
        },
      });
    }

    loadYouTubeAPI();
  }, []);

  // Update player source when the current song changes
  useEffect(() => {
    if (playerRef.current && playerReady && streamQueue.length > 0) {
      playerRef.current.loadVideoById(streamQueue[currentSongIndex]?.extractedId || "");
    }
  }, [currentSongIndex, streamQueue, playerReady]);

  // Handle video state changes
  const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.ENDED) {
      playNextSong();
    }
  };

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % streamQueue.length);
  };

  const pauseVideo = () => {
    if (playerRef.current && playerReady) {
      playerRef.current.pauseVideo();
    }
  };

  // Fetch and manage song streams
  async function findActiveStream() {
    const response = await axios.get("/api/streams/getLiveSpace");
    if (response.status === 201) {
      alert("No space is live. Start the space to play the songs");
      router.push("/dashboard/createSpace");
      return;
    }
    setLiveSpace(response.data.stream);
    getStreamSongs(response.data.stream.id);
  }

  async function getStreamSongs(id) {
    const response = await axios.get(`/api/streams/getSpaceSongs?streamId=${id}`);
    setStreamQueue(response.data.streams);
  }

  useEffect(() => {
    findActiveStream();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-gray-100">
      <main className="flex-1 w-full p-6 overflow-y-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-8">
          <h1 className="text-3xl font-bold mb-4 lg:mb-0">Streamer Dashboard</h1>
          <Button onClick={() => router.push("/dashboard/createSpace")} variant="ghost" className="text-gray-300 hover:text-white">
            <LogOut className="h-5 w-5 mr-2" />
            End Stream
          </Button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Space Title <br />
            <div>{liveSpace ? liveSpace.name.toUpperCase() : ""}</div>
          </h2>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
          <div className="w-full lg:w-[80%] mb-6">
            <div id="youtube-player" className="w-full h-[300px] md:h-[400px]"></div>
          </div>
          <div className="text-center mb-4">
            {streamQueue[currentSongIndex] && (
              <>
                <p className="font-medium text-2xl">{streamQueue[currentSongIndex].title}</p>
                <p className="text-gray-400 text-lg">{streamQueue[currentSongIndex].artist}</p>
              </>
            )}
            <div className="flex justify-center space-x-6 mt-5">
              <Button size="icon" variant="outline" onClick={pauseVideo}>
                <Pause className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="outline" onClick={playNextSong}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
