import type { Request, Response } from "express";
import { getGoogleAccount, getLikedVideos, getPlayList, getSubscription } from "./Feed.service.js";

export const SubscriptionController = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const account = req.googleAccount ?? await getGoogleAccount(userId);

    if (!account) {
      return res.status(404).json({
        message: "Google account not found",
      });
    }

    const data = await getSubscription(account);
    const formattedData = (data.items || []).map((item: any) => ({
      id: item.id,
      channelId: item.snippet?.resourceId?.channelId,
      channelTitle: item.snippet?.title,
      channelThumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      description: item.snippet?.description,
    }));
    return res.json(formattedData);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const PlaylistController = async (req: Request, res: Response) => {
  try {
    const account = req.googleAccount;

    if (!account) {
      return res.status(404).json({
        message: "Google account not found",
      });
    }

    const data = await getPlayList(account);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const playlistItemsController = async (req: Request, res: Response) => {
  try {
    const googleaccount = req.googleAccount;
    if (!googleaccount) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = await getLikedVideos(googleaccount);
    const formattedData = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      videoId: item.snippet?.resourceId?.videoId,
      position: item.snippet?.position,
    }));
    return res.json(formattedData);
  } catch (error) {
    return res.status(404).json({ message: "Liked Videos could not be found", error });
  }
};
