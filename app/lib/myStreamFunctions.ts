import { Dispatch, SetStateAction } from "react"
import axios from "axios"
import { LiveSpace, StreamQueue } from "./interfaces"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { headers } from "next/headers"

export async function addSongToStream({
    userId , streamTitle , liveSpace , userEmail ,setStreamTitle
  } : {
    userId : String,
    streamTitle : String,
    liveSpace :LiveSpace | undefined
    userEmail : String | null | undefined
    setStreamTitle : Dispatch<SetStateAction<string>>
  }) {
    console.log("Creating stream:", streamTitle)
    if (streamTitle == "") {
      alert("Please enter the url")
      return
    }
    console.log(liveSpace?.id)
    const response = await axios.post('/api/streams/addSong', {
      creatorId: userId,
      url: streamTitle,
      spaceId: liveSpace?.id || "",
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

export async function getStreamSongs( {id , setStreamQueue }: { id : string , setStreamQueue : Dispatch<SetStateAction<StreamQueue[] >> }) {
    const response = await axios.get(`/api/streams/getSpaceSongs?streamId=${id}`)
    console.log("This are songs ", response.data.streams)
    setStreamQueue(response.data.streams)
}

export async function findActiveStream({setLiveSpace , router , setStreamQueue} : {setLiveSpace : Dispatch<SetStateAction<LiveSpace | undefined>> ,  router : AppRouterInstance , setStreamQueue : Dispatch<SetStateAction<StreamQueue[] >>}) {
    const response = await axios.get('/api/streams/getLiveSpace')
    if (response.status == 201) {
      alert("No space is live , Start the space to play the songs")
      router.push('/dashboard/createSpace')
      return
    }
    setLiveSpace(response.data.stream)
    let id = response.data.stream.id ;
    getStreamSongs({id , setStreamQueue});
}

export async function stopStreamingStream({userId,liveSpace,router}:{userId : string , liveSpace : LiveSpace | undefined ,  router : AppRouterInstance}) {
    const songs = await axios.put('/api/streams/mySpaces', {
      creatorId: userId,
      streamId: liveSpace?.id
    })
    if (songs.status == 200) {
      alert("Stream Ended")
      router.push('/dashboard/createSpace')
    }
}

export const handleRemoveSong = async (songIndex: number , streamQueue : StreamQueue[] , setStreamQueue : Dispatch<SetStateAction<StreamQueue[]>>) => {

  const response = axios.post('/api/streams/getSpaceSongs',{
    headers:{
      id : streamQueue[songIndex].id,
      streamId : streamQueue[songIndex].spaceId
    }
  });

  const newQueue = [...streamQueue];
  newQueue.splice(songIndex, 1);
  setStreamQueue(newQueue);
};