import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatCard({
  label,
  value,
  trend,
  trendUp = true,
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        border: "1px solid #F0F0F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: "13px",
            color: "#909090",
            margin: 0,
            marginBottom: "4px",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111111",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </p>
        {trend && (
          <p
            style={{
              fontSize: "12px",
              color: trendUp ? "#22C55E" : "#EF4444",
              margin: 0,
              marginTop: "4px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {trendUp ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
