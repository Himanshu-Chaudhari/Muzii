"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Radio, Play, Users } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
export default function CreateStream() {
  const router = useRouter();
  const [spaceTitle, setStreamTitle] = useState("");
  const { data: session } = useSession();
  const alertShownRef = useRef(false);
  const [previousSpaces, setPreviousSpaces] = useState<{
    id: string,
    name: string,
    listeners: 0,
    DateLastStreamed: string
  }[]>([
    { id: '1', name: "Summer Vibes Mix", listeners: 0, DateLastStreamed: "2024-11-19T06:04:46.599Z" },
  ])
  const userEmail = session?.user?.email;
  //@ts-ignore
  const userId = session?.user.id;
  // console.log(userEmail, userId)

  const handleCreateSpace = async () => {
    if (spaceTitle === "") {
      alert("Improper Input");
      return;
    }
    console.log("This is what i want to print :-",userId , spaceTitle)
    // console.log("Creating stream:", spaceTitle);
    const response = await axios.post("/api/streams/createSpace", {
      creator: userId,
      spaceName: spaceTitle,
    });
    if (response.status === 200) {
      alert("Space Created");
      router.push("/dashboard/mySpace");
    }
    setStreamTitle("");
  };

  const startLastStream = async (space: {
    id: string,
    name: string,
    listeners: 0,
    DateLastStreamed: string
  }) => {
    console.log(userId)
    const response = await axios.put("/api/streams/createSpace", {
      creator: userId,
      id: space.id,
    });

    if (response.status === 201) {
      alert("Other Space is Live Pause It to start new one");
      return;
    }
    if (response.status === 200) {
      alert("Space Re-Started");
      router.push("/dashboard/mySpace");
    }
  }

  const checkIfStreamIsLive = async () => {
    if (alertShownRef.current == true)
      return;
    const response = await axios.get("/api/streams/getLiveSpace");
    if (response.status === 200) {
      alertShownRef.current = true;
      alert("Please end the previous space to start a new one");
      router.push("/dashboard/mySpace");
    }
  };

  const getAllStreams = async function () {
    // console.log(userEmail)
    const response = await axios.get(`/api/streams/mySpaces?creatorId=himanshuchaudhari8561@gmail.com`);
    setPreviousSpaces(response.data.space)
  }

  useEffect(() => {
    checkIfStreamIsLive();
    const interval = setInterval(() => {
      getAllStreams()
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Create New Stream</CardTitle>
            <CardDescription className="text-gray-400">
              Enter a title for your new stream and start hosting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter stream title"
                value={spaceTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button
                onClick={handleCreateSpace}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Host Stream
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Previous Streams</CardTitle>
            <CardDescription className="text-gray-400">
              Your past streaming sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {previousSpaces.map((space, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-700 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Radio className="h-8 w-8 text-emerald-500" />
                    <div>
                      <h3 className="font-semibold text-white">{space.name}</h3>
                      <p className="text-sm text-gray-400">{space.DateLastStreamed.split('T')[0] + " " + space.DateLastStreamed.split('T')[1].split('.')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{space.listeners}</span>
                    </div>
                    <Button onClick={() => startLastStream(space)}
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white"
                    >
                      <Play className="h-4 w-4 mr-1" /> Replay
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
