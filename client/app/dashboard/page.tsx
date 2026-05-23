"use client";

import {
  useRecommendations,
  useRefreshRecommendations,
} from "../../lib/useRecommendations";
import { useSubscriptions, useLikedVideos } from "../../lib/useFeed";
import VideoCard from "../components/VideoCard";
import SubscriptionCard from "../components/SubscriptionCard";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import {
  VideoGridSkeleton,
  SubscriptionScrollSkeleton,
} from "../components/LoadingSkeleton";

export default function Dashboard() {
  // Recommendations
  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations,
  } = useRecommendations();

  const {
    loading: refreshing,
    execute: refresh,
  } = useRefreshRecommendations();

  // Subscriptions
  const {
    data: subscriptionsData,
    loading: subscriptionsLoading,
    error: subscriptionsError,
  } = useSubscriptions();

  // Liked Videos
  const {
    data: likedVideosData,
    loading: likedVideosLoading,
    error: likedVideosError,
  } = useLikedVideos();

  // Handle Refresh Action
  const handleRefresh = async () => {
    await refresh();
    await refetchRecommendations();
  };

  const recommendations = Array.isArray(recommendationsData) 
    ? recommendationsData 
    : (recommendationsData as any)?.recommendations || [];
  const subscriptions = subscriptionsData || [];
  const likedVideos = likedVideosData || [];

  return (
    <div
      className="stagger-children"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      {/* ===== RECOMMENDATIONS SECTION ===== */}
      <section>
        <SectionHeader
          title="For You"
          subtitle="Curated based on your interests and liked videos."
          action={
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary"
              style={{
                padding: "8px 16px",
                fontSize: "0.813rem",
                opacity: refreshing ? 0.7 : 1,
                cursor: refreshing ? "not-allowed" : "pointer",
              }}
            >
              {refreshing ? (
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    border: "2px solid var(--text-muted)",
                    borderTopColor: "var(--accent-primary)",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin-slow 0.6s linear infinite",
                  }}
                />
              ) : (
                <RefreshIcon size={16} />
              )}
              {refreshing ? "Refreshing..." : "Refresh Feed"}
            </button>
          }
        />

        {recommendationsError ? (
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <p style={{ color: "var(--accent-primary-bright)" }}>
              Error loading recommendations: {recommendationsError}
            </p>
            <button className="btn-secondary" onClick={refetchRecommendations} style={{ marginTop: "16px" }}>
              Try Again
            </button>
          </div>
        ) : recommendationsLoading && !refreshing ? (
          <VideoGridSkeleton count={8} />
        ) : !Array.isArray(recommendations) || recommendations.length === 0 ? (
          <EmptyState
            icon="✨"
            title="No recommendations yet"
            description="Hit refresh to generate your first batch of AI-curated video recommendations based on your activity."
            action={{
              label: "Generate Feed",
              onClick: handleRefresh,
              loading: refreshing,
            }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
              opacity: refreshing ? 0.5 : 1,
              transition: "opacity var(--transition-base)",
            }}
          >

            {recommendations.map((rec) => (
              <VideoCard
                key={rec.id}
                videoId={rec.videoId}
                videoLink={`https://www.youtube.com/watch?v=${rec.videoId}`}
                title={rec.title}
                channelTitle={rec.channelTitle}
                thumbnail={rec.thumbnail}

              />
            ))}
          </div>
        )}
      </section>

      <hr className="section-divider" />

      {/* ===== SUBSCRIPTIONS SECTION ===== */}
      <section id="subscriptions">
        <SectionHeader
          title="Your Subscriptions"
          subtitle="Channels you're actively following."
        />

        {subscriptionsError ? (
          <p style={{ color: "var(--accent-primary-bright)" }}>
            Error loading subscriptions: {subscriptionsError}
          </p>
        ) : subscriptionsLoading ? (
          <SubscriptionScrollSkeleton />
        ) : !Array.isArray(subscriptions) || subscriptions.length === 0 ? (
          <EmptyState
            icon="📡"
            title="No subscriptions found"
            description="Subscribe to channels on YouTube to see them here."
          />
        ) : (
          <div className="scroll-container">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                channelTitle={sub.channelTitle}
                channelThumbnail={sub.channelThumbnail}
                description={sub.description}
              />
            ))}
          </div>
        )}
      </section>

      <hr className="section-divider" />

      {/* ===== LIKED VIDEOS SECTION ===== */}
      <section id="liked">
        <SectionHeader
          title="Recently Liked"
          subtitle="Videos you've liked that help power your recommendations."
        />

        {likedVideosError ? (
          <p style={{ color: "var(--accent-primary-bright)" }}>
            Error loading liked videos: {likedVideosError}
          </p>
        ) : likedVideosLoading ? (
          <VideoGridSkeleton count={4} />
        ) : !Array.isArray(likedVideos) || likedVideos.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="No liked videos"
            description="Like some videos on YouTube to improve your recommendations."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {likedVideos.slice(0, 8).map((video) => (
              <VideoCard
                key={video.id}
                videoId={video.videoId}
                title={video.title}
                thumbnail={video.thumbnail}
                channelTitle={video.description?.split("\n")[0]} // fallback if channel title isn't separate
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RefreshIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21v-5h5" />
    </svg>
  );
}
