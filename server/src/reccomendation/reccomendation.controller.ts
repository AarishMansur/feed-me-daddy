import type  { Request,Response} from "express";
import { getGoogleAccount } from "../Feed/Feed.service.js";
import { getUserRecommendations, refreshUserRecommendations } from "./reccomendation.service.js";

export const getRecommendationsController = async(req:Request,res:Response)=>{
    try {
        const userId = req.session?.user?.id;
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }
      const recommendations = await getUserRecommendations(userId, 20);
      return res.json({ recommendations });

    } catch (error) {
         return res.status(500).json({ message: "Internal server error", error });
    }
}

export const refreshRecommendationsController = async(req:Request,res:Response)=>{
    try {
        const userId = req.session?.user?.id;
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }

        const account = req.googleAccount ?? await getGoogleAccount(userId);
        if(!account){
            return res.status(404).json({message:"Google account not found"})
        }

        const recommendations = await refreshUserRecommendations(userId, account, 20);
        return res.json({ message: "Recommendations refreshed", recommendations });

    } catch (error) {
         return res.status(500).json({ message: "Internal server error", error });
    }
}
