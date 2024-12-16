import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod'
// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const youtubeUrlRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/(watch\?v=)?[\w-]{11}$/
const spotifyUrlRegex = /^(https?:\/\/open\.spotify\.com\/track\/[\w-]{22}|spotify:track:[\w-]{22})$/

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  spaceId: z.string(),
  addersId: z.string(), 
  url: z.string().url().refine((url) => youtubeUrlRegex.test(url) || spotifyUrlRegex.test(url), {
    message: "URL must be a valid YouTube or Spotify link",
  }),
})

export async function POST(req: NextRequest) {
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const extractedId = data.url.split("?v=")[1]
        const details = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(details.thumbnail.thumbnails)

        const stream = await db.stream.create({
            data : {
                userId : data.creatorId,
                addedBy : data.addersId,
                url : data.url,
                title : details.title ?? "Can't Find Video",
                smallImg : details.thumbnail.thumbnails.length ? details.thumbnail.thumbnails.at(-2).url : details.thumbnail.thumbnails.at(-1).url ?? "",
                bigImg : details.thumbnail.thumbnails.at(-1).url ?? "",
                extractedId : extractedId ,
                type : "Youtube" ,
                spaceId : data.spaceId
            }
        })
        return NextResponse.json({
            "message" : "Stream Created",
            "streamId" : stream.id
        },{
            status : 200
        })
    }catch(err){
        if(err instanceof PrismaClientKnownRequestError){
            return NextResponse.json({
                "message" : err
            },{
                status : 201
            })
        }
        return NextResponse.json({
            "message" : err
        },{
            status : 202
        })
    }
}
