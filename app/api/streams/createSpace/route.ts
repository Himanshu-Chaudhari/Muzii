import db from "@/app/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const responsePOSTType = z.object({
    creator : z.string(),
    spaceName : z.string().min(1)
})

const responsePUTType = z.object({
    id : z.string()
})

export async function POST( req : NextRequest) {
    try{
        const body = await req.json();
        responsePOSTType.parse(body)
        const response = await db.space.create({
            data : {
                name : body.spaceName ? body.spaceName : "" ,
                hostId : body.creator ? body.creator : "" ,
            }
        })
        return NextResponse.json({
            message : "stream created",
        },{
            status : 200
        })
    }catch(err){
        return NextResponse.json({
            message : "error",
            error : err,
        },{
            status : 400
        })
    }
}

export async function PUT( req : NextRequest) {
    try{
        const body = await req.json();
        console.log(body)
        responsePUTType.parse(body)

        const checkingAnyOneIsLive = await db.space.findFirst({
            where :{
                hostId : body.creatorId,
                isActive : true
            }
        })
        if(checkingAnyOneIsLive!=null){
            return NextResponse.json({
                message : "Other streams are live end it before starting new one",
            },{
                status : 201
            })
        }

        const response = await db.space.update({
            where : {
                id : body.id ? body.id : "" ,
            },
            data : {
                isActive : true
            }
        })
        console.log(response)
        return NextResponse.json({
            message : "stream created",
        },{
            status : 200
        })
    }catch(err){
        return NextResponse.json({
            message : "error",
            error : err,
        },{
            status : 400
        })
    }
}