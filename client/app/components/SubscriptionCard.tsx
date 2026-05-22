"use client";

interface SubscriptionCardProps {
  channelTitle?: string;
  channelThumbnail?: string;
  description?: string;
}

export default function SubscriptionCard({
  channelTitle,
  channelThumbnail,
  description,
}: SubscriptionCardProps) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "20px 16px",
        width: "180px",
        minWidth: "180px",
        textAlign: "center",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid var(--border-accent)",
          flexShrink: 0,
          background: "var(--bg-elevated)",
        }}
      >
        {channelThumbnail ? (
          <img
            src={channelThumbnail}
            alt={channelTitle || "Channel"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
            }}
          >
            {(channelTitle || "C")[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0, width: "100%" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.813rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {channelTitle || "Unknown Channel"}
        </p>
        {description && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.688rem",
              color: "var(--text-muted)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
