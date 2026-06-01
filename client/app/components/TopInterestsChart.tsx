const cx = 70, cy = 70, r = 46, strokeWidth = 20;
const circumference = 2 * Math.PI * r;

const interests = [
  { label: "Technology", percentage: 28, color: "#EF5350" },
  { label: "Self Improvement", percentage: 25, color: "#FFA726" },
  { label: "Science", percentage: 20, color: "#7C4DFF" },
  { label: "Productivity", percentage: 15, color: "#EC407A" },
  { label: "Others", percentage: 12, color: "#BDBDBD" },
];

function buildSegments() {
  let cumulative = 0;
  return interests.map((item) => {
    const startAngle = -90 + (cumulative / 100) * 360;
    const dashLen = Math.max(0, (item.percentage / 100) * circumference - 4);
    cumulative += item.percentage;
    return { ...item, startAngle, dashLen };
  });
}

export default function TopInterestsChart() {
  const segments = buildSegments();

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "16px",
        border: "1px solid #F0F0F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#111111",
          margin: 0,
          marginBottom: "20px",
        }}
      >
        Your Top Interests
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Donut Chart */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ flexShrink: 0 }}
        >
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dashLen} ${circumference}`}
              strokeLinecap="butt"
              transform={`rotate(${seg.startAngle}, ${cx}, ${cy})`}
              style={{ transition: "stroke-dasharray 0.3s ease" }}
            />
          ))}
          {/* Center white circle for donut hole */}
          <circle cx={cx} cy={cy} r={r - strokeWidth / 2 - 2} fill="white" />
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          {interests.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "12px", color: "#404040", fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#111111",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
