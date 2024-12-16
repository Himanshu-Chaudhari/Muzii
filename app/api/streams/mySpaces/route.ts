import db from "@/app/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req : NextRequest) {
    try{
        const creatorEmail = req.nextUrl.searchParams.get("creatorId") ?? ""
        const space = await db.space.findMany({
            where:{
                host: {
                    email : creatorEmail
                }
            }
        })
        // console.log(space)
        return NextResponse.json({
            space : space
        })
    }catch(err){
        console.log(err)
        return NextResponse.json({
            error : err
        })
    }
}

export async function PUT(req:NextRequest) {
    try{
        const body :{
            creator : string
            streamId : string
        } = await req.json()
        const response = await db.space.update({
            where : {
                id : body.streamId
            },
            data : {
                isActive : false
            }
        })
        return NextResponse.json({
            message : "Stream Paused"
        },{
            status : 200
        })
    }catch(err){
        return NextResponse.json({
            message : err
        },{
            status : 400
        })
    }
}

export async function DELETE(req:NextRequest) {
    try{

    }catch(err){
        return NextResponse.json({
            message : err
        })
    }
}