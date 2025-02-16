
export interface LiveSpace{
    id: string,
    hostId: string,
    isActive: boolean,
    name: string
  }
  
  export interface StreamQueue{
    _count : {
        upvotes : number
    }
    title: string,
    artist: string,
    thumbnail: string,
    addedBy: string,
    bigImg: string,
    createAt: Date,
    extractedId: string,
    id: string,
    played: string,
    playedTs: null,
    smallImg: string,
    spaceId: string,
    type: "Youtube",
    url: string,
    userId: string
  }