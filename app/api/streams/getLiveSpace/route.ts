import db from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    const response : {
        id: string,
        name: string,
        hostId: string,
        isActive: boolean
    } | null = await db.space.findFirst({
        where : {
            isActive : true
        }
    })
    if(response==null){
        return NextResponse.json({
            message : "No space is live"
        },{
            status : 201
        })
    }
    return NextResponse.json({
        message : "Space is Active",
        stream : response
    },{
        status : 200
    })
}