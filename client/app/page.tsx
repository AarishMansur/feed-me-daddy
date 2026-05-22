"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "./lib/auth-client";
import GoogleSignInButton from "./components/GoogleSignInButton";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && !isPending) {
      router.replace("/dashboard");
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
            width: "40px",
            height: "40px",
            border: "3px solid var(--bg-elevated)",
            borderTopColor: "var(--accent-primary)",
            borderRadius: "50%",
            animation: "spin-slow 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div
        className="hero-gradient hero-gradient-red"
        style={{
          width: "600px",
          height: "600px",
          top: "-200px",
          right: "-100px",
          position: "absolute",
        }}
      />
      <div
        className="hero-gradient hero-gradient-orange animate-float"
        style={{
          width: "400px",
          height: "400px",
          bottom: "100px",
          left: "-100px",
          position: "absolute",
          animationDelay: "2s",
        }}
      />
      <div
        className="hero-gradient hero-gradient-pink"
        style={{
          width: "300px",
          height: "300px",
          top: "40%",
          right: "20%",
          position: "absolute",
          opacity: 0.2,
        }}
      />

      {/* ===== MINIMAL NAVBAR ===== */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background:
                "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🔥
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "var(--text-primary)",
            }}
          >
            Feed Me
          </span>
        </div>
        <GoogleSignInButton />
      </header>

      {/* ===== HERO SECTION ===== */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 32px 60px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-accent)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--accent-glow)",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent-primary-bright)",
              animation: "pulseGlow 2s ease-in-out infinite",
            }}
          />
          Powered by your YouTube activity
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "0 0 24px",
            fontFamily: "var(--font-heading)",
          }}
        >
          Your YouTube Feed,{" "}
          <span className="gradient-text">Supercharged</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-in-up"
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            maxWidth: "560px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
            animationDelay: "0.1s",
          }}
        >
          We analyze your liked videos and subscriptions to surface hidden gems
          you&apos;ll actually want to watch. No algorithm games — just pure discovery.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-in-up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            animationDelay: "0.2s",
          }}
        >
          <GoogleSignInButton size="large" />
        </div>

        {/* Trust line */}
        <p
          className="animate-fade-in"
          style={{
            marginTop: "20px",
            fontSize: "0.75rem",
            color: "var(--text-dim)",
            animationDelay: "0.4s",
          }}
        >
          🔒 Read-only YouTube access • No data stored beyond your session
        </p>
      </main>

      {/* ===== FEATURES SECTION ===== */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 32px 100px",
        }}
      >
        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          <FeatureCard
            icon="🎯"
            title="Smart Recommendations"
            description="Our engine builds an interest profile from your activity and finds videos that match your taste — not just what's trending."
            accentColor="var(--accent-primary)"
          />
          <FeatureCard
            icon="📡"
            title="Track Subscriptions"
            description="See all your subscribed channels in one clean view. Stay connected with the creators you actually care about."
            accentColor="var(--accent-secondary)"
          />
          <FeatureCard
            icon="❤️"
            title="Liked Videos"
            description="Your liked videos, beautifully organized. Revisit your favorites and let them power even better recommendations."
            accentColor="var(--accent-glow)"
          />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "24px 32px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            color: "var(--text-dim)",
          }}
        >
          Built with 🔥 • Feed Me Daddy
        </p>
      </footer>
    </div>
  );
}

/* ===== Feature Card Component ===== */
function FeatureCard({
  icon,
  title,
  description,
  accentColor,
}: {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-elevated)",
          border: `1px solid ${accentColor}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: "1.125rem",
          fontWeight: 700,
          fontFamily: "var(--font-heading)",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}
