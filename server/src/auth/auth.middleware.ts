import { auth } from "../lib/auth.js";
import type{ Request,Response,NextFunction } from "express";

export const authMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
    const session = await auth.api.getSession({
        headers:new Headers(req.headers as HeadersInit),
    })

    req.session = session

    next();
}