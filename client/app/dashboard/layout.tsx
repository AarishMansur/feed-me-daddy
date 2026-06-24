"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import Sidebar from "../components/Sidebar";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F8F6",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #EBEBEB",
              borderTopColor: "#FF0000",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: "14px", color: "#909090" }}>
            Loading your feed...
          </span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F8F8F6",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        user={session.user}
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* Main scrollable content — no left margin on mobile (sidebar overlays) */}
      <div
        style={{
          marginLeft: isMobile ? "0px" : "220px",
          flex: 1,
          minHeight: "100vh",
          overflowY: "auto",
          backgroundColor: "#F8F8F6",
          transition: "margin-left 0.3s ease",
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
