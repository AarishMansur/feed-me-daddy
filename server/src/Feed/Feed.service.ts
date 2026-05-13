import {prisma} from "../lib/prisma.js"


export const getGoogleAccount = async(userId:string)=>{
    return prisma.account.findFirst({
        where:{
            userId,
            providerId:"google"
        }
    })
}

export const getSubscription = async(accessToken:string)=>{
    const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20`,
        {
            headers:{
                Authorization : `Bearer ${accessToken}`
            }
        }
    )
      return response.json()
}

export const getPlayList = async(accessToken:string)=>{
    const data = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=20`,

        {
            headers:{
                Authorization :`Bearer ${accessToken}`
            }
        }
    )
    return data.json();
}