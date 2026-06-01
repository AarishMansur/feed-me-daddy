"use client";

import { useState } from "react";

interface SuggestedFeedRowProps {
  channelTitle: string;
  channelThumbnail?: string | null;
  category?: string | null;
  subscriberCount?: string;
}

export default function SuggestedFeedRow({
  channelTitle,
  channelThumbnail,
  category,
  subscriberCount,
}: SuggestedFeedRowProps) {
  const [subscribed, setSubscribed] = useState(false);

  const initials = channelTitle
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 0",
        borderBottom: "1px solid #F5F5F5",
      }}
    >
      {/* Channel Avatar */}
      {channelThumbnail ? (
        <img
          src={channelThumbnail}
          alt={channelTitle}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#F0F0F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "13px",
            color: "#606060",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}

      {/* Channel Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#111111",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {channelTitle}
          </span>
          {/* Verified badge */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A73E8">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "#909090",
            margin: 0,
            marginTop: "1px",
          }}
        >
          {category || "YouTube Channel"}
        </p>
      </div>

      {/* Subscriber Count */}
      {subscriberCount && (
        <span
          style={{
            fontSize: "13px",
            color: "#909090",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {subscriberCount}
        </span>
      )}

      {/* Subscribe Button */}
      <button
        onClick={() => setSubscribed((s) => !s)}
        style={{
          padding: "7px 16px",
          borderRadius: "20px",
          border: subscribed ? "1.5px solid #D0D0D0" : "1.5px solid #FF0000",
          backgroundColor: subscribed ? "transparent" : "transparent",
          color: subscribed ? "#909090" : "#FF0000",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
          transition: "all 0.15s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          if (!subscribed) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFF0F0";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        {subscribed ? "Subscribed ✓" : "Subscribe"}
      </button>
    </div>
  );
}
