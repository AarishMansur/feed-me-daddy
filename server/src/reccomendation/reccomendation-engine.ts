import { buildInterestProfile,analyzeVideoInterests } from "./interest-analyzer.js";

type Videeo = {
    id?:string
    title?:string
    description?:string
    thumbnail?:string
    link?:string
}



type InterestProfile = Record<string, number>;

type Reccomendation = {
    videoID:string
    videoLink:string
    thumbnail:string
    category:string
    score:number
    matchkeywoard:string[];
}

export const scoreVideo = (video:Videeo,interestProfile:InterestProfile):{score:number;category:string;keywords:string[]}=>{
    const matches = analyzeVideoInterests(video);
  
    let totalScore = 0;
    let primaryCategory ="";
    const allKeywords:string[] = [];

    for(const[category,keywords] of Object.entries(matches)){
        const categoryInterest = interestProfile[category] || 0;
        const categoryScore = keywords.length * categoryInterest

        if(categoryScore>totalScore){
            totalScore = categoryScore;
            primaryCategory = category;
        }

        allKeywords.push(...keywords)
    }

    const normalizedScore = Math.min(totalScore * 100,100);

    return{
        score:normalizedScore,
        category:primaryCategory ||"general",
        keywords:allKeywords
    }
}


export const generateRecommendations = (videos:Videeo[],likedVideosID:Set<string>,interestProfile:InterestProfile,maxResults:number = 10):Reccomendation[]=>{
    const candidates = videos.filter(v=>!likedVideosID.has(v.id || ""));
    const scored = candidates.map(video=>({video,...scoreVideo(video,interestProfile),}))
   scored.sort((a,b)=>b.score-a.score);

    const reccomendations: Reccomendation[] = scored.slice(0, maxResults).map(item => ({
    videoID: item.video.id || "",
    videoLink: item.video.link || "",
    thumbnail: item.video.thumbnail || "",
    category: item.category,
    score: item.score,
    matchkeywoard: item.keywords,
  }));

  return  reccomendations;
};


export const deduplicateRecommendations = (
  recommendations: Reccomendation[]
): Reccomendation[] => {
  const seen = new Set<string>();
  return recommendations.filter(rec => {
    if (seen.has(rec.videoID)) {
      return false;
    }
    seen.add(rec.videoID);
    return true;
  });
};