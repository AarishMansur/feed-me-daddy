interface RecommendedVideoItemProps {
  thumbnail?: string | null;
  title: string;
  channelTitle?: string | null;
  duration?: string;
  timeAgo?: string;
  videoId?: string;
}

export default function RecommendedVideoItem({
  thumbnail,
  title,
  channelTitle,
  duration,
  timeAgo,
  videoId,
}: RecommendedVideoItemProps) {
  const handleClick = () => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        cursor: videoId ? "pointer" : "default",
        padding: "6px 0",
        borderBottom: "1px solid #F5F5F5",
        transition: "opacity 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.opacity = "0.8";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.opacity = "1";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "96px",
          height: "54px",
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "#E8E8E8",
          position: "relative",
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}
        {/* Duration badge */}
        {duration && (
          <span
            style={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              fontSize: "10px",
              fontWeight: 600,
              padding: "1px 4px",
              borderRadius: "3px",
            }}
          >
            {duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#111111",
            margin: 0,
            marginBottom: "4px",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#909090",
            margin: 0,
            marginBottom: "2px",
          }}
        >
          {channelTitle || "Unknown Channel"}
        </p>
        {timeAgo && (
          <p style={{ fontSize: "12px", color: "#B0B0B0", margin: 0 }}>
            {timeAgo}
          </p>
        )}
      </div>
    </div>
  );
}
