"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";

interface SidebarProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon },
  { id: "subscriptions", label: "Subscriptions", icon: SubscriptionsIcon },
  { id: "liked", label: "Liked Videos", icon: HeartIcon },
  { id: "recommendations", label: "Recommendations", icon: SparklesIcon },
];

export default function Sidebar({ user, activeSection = "dashboard", onNavigate }: SidebarProps) {
  const handleNavClick = (id: string) => {
    onNavigate?.(id);
    if (id === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "220px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #F0F0F0",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "20px 18px 16px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            backgroundColor: "#FF0000",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
            <path
              d="M16.5 2.07C16.3.85 15.35.05 14.12.03 12.07 0 8.5 0 8.5 0S4.93 0 2.88.03C1.65.05.7.85.5 2.07 0 3.62 0 6.5 0 6.5s0 2.88.5 4.43c.2 1.22 1.15 2.02 2.38 2.04C4.93 13 8.5 13 8.5 13s3.57 0 5.62-.03c1.23-.02 2.18-.82 2.38-2.04C17 9.38 17 6.5 17 6.5s0-2.88-.5-4.43zM6.8 9.25V3.75L11.73 6.5 6.8 9.25z"
              fill="white"
            />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "14.5px",
            color: "#111111",
            letterSpacing: "-0.02em",
          }}
        >
          FeedmeDaddy
        </span>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "4px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          overflowY: "auto",
        }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <NavButton
              key={item.id}
              label={item.label}
              icon={<Icon />}
              isActive={isActive}
              onClick={() => handleNavClick(item.id)}
            />
          );
        })}
      </nav>

      <div
        style={{
          padding: "12px 14px 14px",
          borderTop: "1px solid #F0F0F0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
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
              backgroundColor: "#FFF0F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FF0000",
              fontWeight: 700,
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {(user.name?.[0] || user.email[0] || "U").toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#111111",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            {user.name || "User"}
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "#909090",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.4,
            }}
          >
            {user.email}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 14px 14px" }}>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#FFF0F0",
            color: "#FF0000",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFE0E0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFF0F0")}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

function NavButton({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "9px 11px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "13.5px",
        fontWeight: isActive ? 600 : 500,
        backgroundColor: isActive
          ? "#FFF1F1"
          : hovered
            ? "#F7F7F7"
            : "transparent",
        color: isActive ? "#FF0000" : hovered ? "#111111" : "#606060",
        transition: "background-color 0.12s ease, color 0.12s ease",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          color: isActive ? "#FF0000" : hovered ? "#404040" : "#A0A0A0",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "color 0.12s ease",
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function SubscriptionsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <polygon points="10 9 15 12 10 15 10 9" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
function AnalyticsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}
function SparklesIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
