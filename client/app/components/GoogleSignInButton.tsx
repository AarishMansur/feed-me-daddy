"use client";

import { authClient } from "../lib/auth-client";

interface GoogleSignInButtonProps {
  callbackURL?: string;
  size?: "default" | "large";
}

export default function GoogleSignInButton({
  callbackURL = "/dashboard",
  size = "default",
}: GoogleSignInButtonProps) {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${callbackURL}`,
    });
  };

  const isLarge = size === "large";

  return (
    <button
      onClick={handleSignIn}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isLarge ? "12px" : "10px",
        padding: isLarge ? "16px 36px" : "12px 28px",
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: isLarge ? "1rem" : "0.875rem",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        transition: "all var(--transition-base)",
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-elevated)";
        e.currentTarget.style.borderColor = "var(--border-accent)";
        e.currentTarget.style.boxShadow = "var(--glow-red)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-surface)";
        e.currentTarget.style.borderColor = "var(--border-light)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <GoogleIcon size={isLarge ? 22 : 18} />
      Continue with Google
    </button>
  );
}

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
