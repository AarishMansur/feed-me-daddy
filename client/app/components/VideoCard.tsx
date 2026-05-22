"use client";

interface VideoCardProps {
  title?: string;
  thumbnail?: string;
  channelTitle?: string;
  videoId?: string;
  videoLink?: string;
  publishedAt?: string;
  category?: string;
}

export default function VideoCard({
  title,
  thumbnail,
  channelTitle,
  videoId,
  videoLink,
  publishedAt,
  category,
}: VideoCardProps) {
  const href =
    videoLink || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#");

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", /* 16:9 */
          overflow: "hidden",
          background: "var(--bg-elevated)",
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title || "Video thumbnail"}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform var(--transition-slow)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-dim)",
            }}
          >
            <PlayIcon size={40} />
          </div>
        )}

        {/* Play overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15, 10, 10, 0.5)",
            opacity: 0,
            transition: "opacity var(--transition-base)",
          }}
          className="play-overlay"
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(220, 38, 38, 0.5)",
            }}
          >
            <PlayIcon size={22} />
          </div>
        </div>

        {/* Category badge */}
        {category && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              padding: "3px 10px",
              borderRadius: "var(--radius-full)",
              background: "rgba(15, 10, 10, 0.75)",
              backdropFilter: "blur(8px)",
              fontSize: "0.688rem",
              fontWeight: 600,
              color: "var(--accent-glow)",
              textTransform: "capitalize",
              border: "1px solid rgba(251, 113, 133, 0.2)",
            }}
          >
            {category.replace(/_/g, " ")}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "0.875rem",
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            color: "var(--text-primary)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            letterSpacing: "normal",
          }}
        >
          {title || "Untitled Video"}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          {channelTitle && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "70%",
              }}
            >
              {channelTitle}
            </span>
          )}
          {formattedDate && (
            <span
              style={{
                fontSize: "0.688rem",
                color: "var(--text-dim)",
              }}
            >
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        a:hover .play-overlay {
          opacity: 1;
        }
      `}</style>
    </a>
  );
}

function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}
