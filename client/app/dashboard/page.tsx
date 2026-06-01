"use client";

import React from "react";
import { authClient } from "../lib/auth-client";
import {
  useRecommendations,
  useRefreshRecommendations,
} from "../../lib/useRecommendations";
import { useSubscriptions, useLikedVideos } from "../../lib/useFeed";

import StatCard from "../components/StatCard";
import SuggestedFeedRow from "../components/SuggestedFeedRow";
import TopInterestsChart from "../components/TopInterestsChart";
import RecommendedVideoItem from "../components/RecommendedVideoItem";
import ContinueWatchingCard from "../components/ContinueWatchingCard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getWaveEmoji() {
  const h = new Date().getHours();
  if (h < 12) return "👋";
  if (h < 17) return "☀️";
  return "🌙";
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

const MOCK_PROGRESS = [75, 40, 60, 80];
const MOCK_DURATIONS = ["18:24", "11:56", "13:42", "22:15"];

export default function Dashboard() {
  const { data: session } = authClient.useSession();

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    refetch: refetchRecommendations,
  } = useRecommendations();

  const { loading: refreshing, execute: refresh } =
    useRefreshRecommendations();

  const {
    data: subscriptionsData,
    loading: subscriptionsLoading,
  } = useSubscriptions();

  const {
    data: likedVideosData,
    loading: likedLoading,
  } = useLikedVideos();

  const recommendations = Array.isArray(recommendationsData)
    ? recommendationsData
    : (recommendationsData as any)?.recommendations || [];
  const subscriptions = subscriptionsData || [];
  const likedVideos = likedVideosData || [];

  const handleRefresh = async () => {
    await refresh();
    await refetchRecommendations();
  };

  const handleSurpriseMe = () => {
    if (recommendations.length > 0) {
      const random = recommendations[Math.floor(Math.random() * recommendations.length)];
      if (random?.videoId) {
        window.open(`https://www.youtube.com/watch?v=${random.videoId}`, "_blank");
      }
    }
  };

  const userName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div style={{ padding: "20px 32px 32px", width: "100%", margin: "0 auto" }}>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111111",
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {getGreeting()}, {userName} {getWaveEmoji()}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#909090",
              margin: 0,
              marginTop: "5px",
            }}
          >
            Here&apos;s what&apos;s happening with your feed today.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <button
            style={iconBtnStyle}
            title="Notifications"
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0F0F0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #F0F0F0" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              backgroundColor: "#FFF0F0", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FF0000", fontWeight: 700, fontSize: "14px",
            }}>
              {(session?.user?.name?.[0] || "U").toUpperCase()}
            </div>
          )}

          <button
            onClick={handleSurpriseMe}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #E8E8E8",
              borderRadius: "20px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#111111",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "#FF0000";
              b.style.color = "#FF0000";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "#E8E8E8";
              b.style.color = "#111111";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            Surprise Me
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Subscriptions"
          value={subscriptionsLoading ? "—" : subscriptions.length}
          trend={subscriptions.length > 0 ? `${Math.min(4, subscriptions.length)} this month` : undefined}
          trendUp
          iconBg="#FFF0F0"
          icon={
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none">
              <path d="M21.5 2.57C21.3.82 19.97.04 18.62.03 16.06 0 11 0 11 0S5.94 0 3.38.03C2.03.04.7.82.5 2.57 0 4.63 0 8.5 0 8.5s0 3.87.5 5.93c.2 1.75 1.53 2.53 2.88 2.54C5.94 17 11 17 11 17s5.06 0 7.62-.03c1.35-.01 2.68-.79 2.88-2.54C22 12.37 22 8.5 22 8.5s0-3.87-.5-5.93zM8.8 12.25V4.75L14.73 8.5 8.8 12.25z" fill="#FF0000" />
            </svg>
          }
        />
        <StatCard
          label="Liked Videos"
          value={likedLoading ? "—" : likedVideos.length}
          trend={likedVideos.length > 0 ? `${Math.min(18, likedVideos.length)} this month` : undefined}
          trendUp
          iconBg="#FFF0F0"
          icon={
            <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
              <path d="M20.84 3.61a5.5 5.5 0 0 0-7.78 0L12 4.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#FF4D6D" stroke="#FF4D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />

        <StatCard
          label="Hours Saved"
          value="18.4"
          trend="This month"
          trendUp={false}
          iconBg="#F0EDFF"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C4DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
          }
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <section
            id="subscriptions"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid #F0F0F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111111", margin: 0 }}>
                  Suggested Feeds For You
                </h2>
                <p style={{ fontSize: "12.5px", color: "#909090", margin: 0, marginTop: "3px" }}>
                  Curated channels based on your interests
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  border: "1.5px solid #E8E8E8",
                  backgroundColor: "transparent",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#606060",
                  cursor: refreshing ? "not-allowed" : "pointer",
                  opacity: refreshing ? 0.6 : 1,
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!refreshing) (e.currentTarget as HTMLButtonElement).style.borderColor = "#B0B0B0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E8E8";
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }}
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21v-5h5" />
                </svg>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div style={{ marginTop: "8px" }}>
              {subscriptionsLoading ? (
                <SkeletonRows count={5} />
              ) : subscriptions.length === 0 ? (
                <EmptyMsg icon="📡" text="No subscriptions found. Subscribe to channels on YouTube to see them here." />
              ) : (
                <>
                  {subscriptions.slice(0, 4).map((sub) => (
                    <SuggestedFeedRow
                      key={sub.id}
                      channelTitle={sub.channelTitle}
                      channelThumbnail={sub.channelThumbnail}
                      category={sub.description?.split("\n")[0]?.slice(0, 30) || "YouTube Channel"}
                      subscriberCount={undefined}
                    />
                  ))}
                  {subscriptions.length > 5 && (
                    <div style={{ textAlign: "center", paddingTop: "14px" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#606060",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#111")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#606060")}
                      >
                        View More Suggestions
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section
            id="liked"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid #F0F0F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111111", margin: 0 }}>
                Continue Watching
              </h2>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#606060",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#111")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#606060")}
              >
                View all
              </button>
            </div>

            {likedLoading ? (
              <SkeletonCards count={4} />
            ) : likedVideos.length === 0 ? (
              <EmptyMsg icon="▶️" text="Like some videos on YouTube to see them here." />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                  scrollbarWidth: "none",
                }}
              >
                {likedVideos.slice(0, 4).map((video, i) => (
                  <ContinueWatchingCard
                    key={video.id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    channelTitle={video.description?.split("\n")[0] || "YouTube"}
                    duration={MOCK_DURATIONS[i % MOCK_DURATIONS.length]}
                    progress={MOCK_PROGRESS[i % MOCK_PROGRESS.length]}
                    videoId={video.videoId}
                    index={i}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <TopInterestsChart />

          <section
            id="recommendations"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid #F0F0F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111111", margin: 0 }}>
                Recommended For You
              </h2>
              <button
                onClick={handleRefresh}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#606060",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#111")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#606060")}
              >
                Refresh
              </button>
            </div>

            <div style={{ marginTop: "12px" }}>
              {recommendationsLoading && !refreshing ? (
                <SkeletonVideoItems count={3} />
              ) : recommendations.length === 0 ? (
                <EmptyMsg
                  icon="✨"
                  text="Hit 'Surprise Me' to generate your first AI-curated recommendations."
                />
              ) : (
                recommendations.slice(0, 4).map((rec: any) => (
                  <RecommendedVideoItem
                    key={rec.id}
                    thumbnail={rec.thumbnail}
                    title={rec.title}
                    channelTitle={rec.channelTitle}
                    videoId={rec.videoId}
                    timeAgo={timeAgo((rec as any).publishedAt)}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
};

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 0",
            borderBottom: "1px solid #F5F5F5",
          }}
        >
          <div style={shimmer(42, 42, "50%")} />
          <div style={{ flex: 1 }}>
            <div style={shimmer(140, 13, 4)} />
            <div style={{ ...shimmer(90, 11, 4), marginTop: "6px" }} />
          </div>
          <div style={shimmer(80, 32, 20)} />
        </div>
      ))}
    </>
  );
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: "200px", flexShrink: 0 }}>
          <div style={shimmer(200, 110, 10)} />
          <div style={{ ...shimmer(160, 13, 4), marginTop: "10px" }} />
          <div style={{ ...shimmer(100, 11, 4), marginTop: "6px" }} />
        </div>
      ))}
    </div>
  );
}

function SkeletonVideoItems({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "12px",
            padding: "8px 0",
            borderBottom: "1px solid #F5F5F5",
          }}
        >
          <div style={shimmer(96, 54, 8)} />
          <div style={{ flex: 1 }}>
            <div style={shimmer("80%", 13, 4)} />
            <div style={{ ...shimmer("60%", 11, 4), marginTop: "6px" }} />
            <div style={{ ...shimmer("40%", 11, 4), marginTop: "4px" }} />
          </div>
        </div>
      ))}
    </>
  );
}

function shimmer(
  width: number | string,
  height: number,
  borderRadius: number | string
): React.CSSProperties {
  return {
    width: typeof width === "number" ? `${width}px` : width,
    height: `${height}px`,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    background: "linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
    display: "block",
  };
}

function EmptyMsg({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "28px 16px",
        color: "#B0B0B0",
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
      {text}
    </div>
  );
}
