import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
        try {
        const streamId = req.nextUrl.searchParams.get("streamId");
        console.log("This is streamId:- ", streamId);
        const streams = await db.stream.findMany({
            where:{
                spaceId : streamId ? streamId : ""
            }
        })
        if(streams == null){
            return NextResponse.json({
                message : "This space doesnt have any streams, Adding streams to play in this space",
            }, {
                status : 200
            })
        }
        return NextResponse.json({
            message: "Streams in the given Space",
            streams : streams,
        });
    }catch(err){
        return NextResponse.json({
            err
        });    
    }
}
