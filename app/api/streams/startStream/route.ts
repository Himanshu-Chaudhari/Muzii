import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod'
// @ts-ignore
import youtubesearchapi from "youtube-search-api";

const youtubeUrlRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/(watch\?v=)?[\w-]{11}$/
const spotifyUrlRegex = /^(https?:\/\/open\.spotify\.com\/track\/[\w-]{22}|spotify:track:[\w-]{22})$/

const StartStreamSchema = z.object({
  creatorId: z.string(),
  title: z.string(),
})

export async function POST(req: NextRequest) {
    try{
        const data = StartStreamSchema.parse(await req.json());
        const creatorId = data.creatorId
        const activeStream = await db.space.findFirst({
            where : {
                hostId : creatorId
            }
        })
        if(activeStream && activeStream?.isActive){
            return NextResponse.json({
                "message" : "Other stream is already being played",
            })
        }
        const newStream = await db.space.create({
            data :{
                name : data.title ,
                hostId : data.creatorId
            }
        })
        return NextResponse.json({
            "message" : "Stream Created",
            "streamId" : newStream.id
        })
    }catch(err){
        return NextResponse.json({
            "message" : err
        },{
            status : 411
        })
    }
}
