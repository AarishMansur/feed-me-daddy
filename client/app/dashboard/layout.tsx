"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "../lib/auth-client";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

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
          background: "var(--bg-deepest)",
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
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--bg-elevated)",
              borderTopColor: "var(--accent-primary)",
              borderRadius: "50%",
              animation: "spin-slow 0.8s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
            }}
          >
            Loading your feed...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar user={session.user} />
      <main
        style={{
          flex: 1,
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
