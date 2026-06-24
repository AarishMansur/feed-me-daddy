interface ContinueWatchingCardProps {
  thumbnail?: string | null;
  title: string;
  channelTitle?: string | null;
  duration?: string;
  progress?: number; // 0–100
  videoId?: string;
  index?: number;
}

const PROGRESS_COLORS = ["#FF0000", "#FF6B35", "#7C4DFF", "#22C55E"];

export default function ContinueWatchingCard({
  thumbnail,
  title,
  channelTitle,
  duration,
  progress = 0,
  videoId,
  index = 0,
}: ContinueWatchingCardProps) {
  const handleClick = () => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    }
  };

  const progressColor = PROGRESS_COLORS[index % PROGRESS_COLORS.length];

  return (
    <div
      onClick={handleClick}
      style={{
        width: "200px",
        minWidth: "160px",
        flexShrink: 0,
        cursor: videoId ? "pointer" : "default",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          height: "110px",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#E8E8E8",
          position: "relative",
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", maxWidth: "none", display: "block" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1F1F1F, #2D2D2D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}
        {/* Duration badge */}
        {duration && (
          <span
            style={{
              position: "absolute",
              bottom: "6px",
              right: "6px",
              backgroundColor: "rgba(0,0,0,0.82)",
              color: "white",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 5px",
              borderRadius: "4px",
            }}
          >
            {duration}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "3px",
          backgroundColor: "#EBEBEB",
          borderRadius: "2px",
          marginTop: "0px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: progressColor,
            borderRadius: "2px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ marginTop: "8px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#111111",
            margin: 0,
            marginBottom: "3px",
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
          }}
        >
          {channelTitle || "YouTube"}
        </p>
        {progress > 0 && (
          <p
            style={{
              fontSize: "11px",
              color: progressColor,
              margin: 0,
              marginTop: "3px",
              fontWeight: 600,
            }}
          >
            {progress}% watched
          </p>
        )}
      </div>
    </div>
  );
}
