import interestData from "./data.json"  with {type:"json"}


type Video = {
  title?:string
  description?:string
}
type Subscription = {
  snippet?:{ 
     title?:string
  description?:string
  }
}

type InterestProfile =  Record<string,number>;

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "must", "can", "this", "that",
  "these", "those", "i", "you", "he", "she", "it", "we", "they"
]);

export const NormalizeText = (text:string):string=>{
  return text.toLocaleLowerCase().replace(/[^\w\s]/g, "").trim();
}

export const extractKeywords = (text:string): string[]=>{
  const normalized = NormalizeText(text);
  return normalized.split(/\s+/).filter(word=> word.length>=2 && !STOP_WORDS.has(word));
}

export const matchKeywordsToCategories = ( keywords: string[]): Record<string, string[]> => {
  const matches: Record<string, string[]> = {};
  const interestMap = interestData.interestMap as Record<string, string[]>;

  for (const [category, categoryKeywords] of Object.entries(interestMap)) {
    const matched = keywords.filter(keyword =>
      categoryKeywords.some(catKeyword =>
        catKeyword.includes(keyword) || keyword.includes(catKeyword)
      )
    );

    if (matched.length > 0) {
      matches[category] = matched;
    }
  }

  return matches;
};


export const analyzeVideoInterests = (video: Video): Record<string, string[]> => {
  const text = `${video.title || ""} ${video.description || ""}`;
  const keywords = extractKeywords(text);
  return matchKeywordsToCategories(keywords);
};

export const analyzeSubscriptionInterests = (
  subscription: Subscription): Record<string, string[]> => {
    
  const text = `${subscription.snippet?.title || ""} ${
    subscription.snippet?.description || ""
  }`;
  const keywords = extractKeywords(text);
  return matchKeywordsToCategories(keywords);
};


export const buildInterestProfile = (videos: Video[], subscriptions: Subscription[]): InterestProfile => {
  const scores: InterestProfile = {};
  const interestMap = interestData.interestMap as Record<string, string[]>;


  for (const category of Object.keys(interestMap)) {
    scores[category] = 0;
  }

  for (const video of videos) {
    const matches = analyzeVideoInterests(video);
    for (const [category, keywords] of Object.entries(matches)) {
      scores[category]! += keywords.length * 1.5;
    }
  }

 
  for (const subscription of subscriptions) {
    const matches = analyzeSubscriptionInterests(subscription);
    for (const [category, keywords] of Object.entries(matches)) {
      scores[category]! += keywords.length * 0.5;
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    for (const category of Object.keys(scores)) {
      scores[category] = scores[category]! / maxScore;
    }
  }

  return scores;
};
