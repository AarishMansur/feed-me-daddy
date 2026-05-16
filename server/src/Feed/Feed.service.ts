import { prisma } from "../lib/prisma.js";
import type { Account } from "../../generated/prisma/client.js";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";

const parseErrorBody = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const checkResponse = async (response: Response) => {
  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new Error(`YouTube API error ${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return response.json();
};

const refreshGoogleAccessToken = async (account: Account) => {
  if (!account.refreshToken) {
    throw new Error("Missing Google refresh token");
  }

  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    grant_type: "refresh_token",
    refresh_token: account.refreshToken,
  });

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`OAuth refresh failed ${response.status}: ${JSON.stringify(payload)}`);
  }

  if (!payload.access_token || !payload.expires_in) {
    throw new Error("Invalid refresh token response from Google");
  }

  return prisma.account.update({
    where: { id: account.id },
    data: {
      accessToken: payload.access_token,
      accessTokenExpiresAt: new Date(Date.now() + payload.expires_in * 1000),
      refreshToken: payload.refresh_token ?? account.refreshToken,
    },
  });
};

export const makeYouTubeRequest = async (account: Account, url: string) => {
  if (!account.accessToken) {
    throw new Error("Missing Google access token");
  }

  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
    },
  });

  if (response.status === 401 && account.refreshToken) {
    account = await refreshGoogleAccessToken(account);
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    });
  }

  return checkResponse(response);
};

export const getGoogleAccount = async (userId: string) => {
  return prisma.account.findFirst({
    where: {
      userId,
      providerId: "google",
    },
  });
};

export const getSubscription = async (account: Account) => {
  return makeYouTubeRequest(
    account,
    `${YOUTUBE_API_BASE}/subscriptions?part=snippet&mine=true&maxResults=20`,
  );
};

export const getPlayList = async (account: Account) => {
  return makeYouTubeRequest(
    account,
    `${YOUTUBE_API_BASE}/playlists?part=snippet&mine=true&maxResults=20`,
  );
};

export const getLikedVideos = async (account: Account) => {
  return makeYouTubeRequest(
    account,
    `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=LL&maxResults=20`,
  );
};

export const searchYouTubeVideos = async (
  account: Account,
  query: string,
  maxResults: number = 10,
) => {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: query,
    maxResults: String(maxResults),
  });

  return makeYouTubeRequest(account, `${YOUTUBE_API_BASE}/search?${params.toString()}`);
};
