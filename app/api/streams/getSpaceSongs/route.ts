import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
        try {
        const streamId = req.nextUrl.searchParams.get("streamId");
        console.log("This is streamId:- ", streamId);
        const streams = await db.stream.findMany({
            where:{
                spaceId : streamId ? streamId : ""
            },
            include:{
                _count:{
                    select:{
                        upvotes : true
                    }
                }
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
        console.log(err);
        return NextResponse.json({
            message : "Server Error",
        }, {
            status : 500
        });    
    }
}

export async function DELETE(req : NextRequest) {
    const streamId = req.headers.get('streamId')
    const id = req.headers.get('id')

    if(!id || !streamId){
        return NextResponse.json({
            "message" : "Invalid Input"
        })
    }
    try{
        await db.stream.delete({
            where : {
                id : id
            }
        })
        return NextResponse.json({
            "message" : "Stream Deleted"
        },{
            status : 200
        })
    }catch(err){
        console.log(err);
        return NextResponse.json({
            "message" : "Internal Server Error"
        },{
            status : 401
        })
    }
}