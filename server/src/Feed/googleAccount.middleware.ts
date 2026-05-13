import type{ Request,Response,NextFunction } from "express";
import { prisma } from "../lib/prisma.js";


export const googleAccountMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
   
    const userId = req.session?.user?.id

    if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

    const googleAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "google",
    },
  });

   if (!googleAccount) {
    return res.status(404).json({
      message: " account not found",
    });
  }

  req.googleAccount = googleAccount;

  next();

}