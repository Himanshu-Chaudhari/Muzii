
import db from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const downvoteSchema = z.object({
    StreamId : z.string()
})

export async function POST(req : NextRequest) {
    try {
        const session = await getServerSession()
        const email = session?.user?.email
        const user = await db.user.findFirst({
            where : {
                email : email ?? ""
            }
        })
        if(!user){
            return NextResponse.json({
                "message" : "UnAuthenticated"
            })
        }
        const streamId : string = await req.json()
        downvoteSchema.parse(streamId)
        await db.upvote.delete({
            where : {
                userId_streamId:{
                    streamId : streamId,
                    userId : user.id
                }
            }    
        })
    }catch(error){
        return NextResponse.json({
            "message" : error
        })
    }
    // const data = req.json()
}