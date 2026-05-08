import type { Request,Response } from "express";
import { getGoogleAccount,getSubscription } from "./Feed.service.js";



export const SubscriptionController  = async(req:Request,res:Response)=>{
    try {
        const userId = req.session?.user?.id;
        const account = await getGoogleAccount(userId);

          if (!account) {
      return res.status(404).json({
        message: "Google account not found",
      });
    }

    const data = await getSubscription(account.accessToken!); // just a workaround a better solution would be to update schame to accept null values too 
    return res.json(data)
    } catch (error) {
        return res.status(500).json({
      message: "Internal server error",
      error,
    });
    }
}