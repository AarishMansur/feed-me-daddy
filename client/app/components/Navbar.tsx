"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user?: {
    name?: string | null;
    email: string;
    image?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Feed", icon: FlameIcon },
    { href: "/dashboard#subscriptions", label: "Subscriptions", icon: UsersIcon },
    { href: "/dashboard#liked", label: "Liked", icon: HeartIcon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="glass-strong"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-md)",
              background:
                "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🔥
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Feed Me
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="hidden-mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "all var(--transition-fast)",
                  background: isActive(link.href)
                    ? "var(--bg-elevated)"
                    : "transparent",
                  color: isActive(link.href)
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  border: isActive(link.href)
                    ? "1px solid var(--border-accent)"
                    : "1px solid transparent",
                }}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 12px 4px 4px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--accent-primary), var(--accent-glow))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
                <span
                  className="hidden-mobile"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name || user.email.split("@")[0]}
                </span>
                <ChevronDownIcon size={14} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <>
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 40,
                    }}
                    onClick={() => setProfileOpen(false)}
                  />
                  <div
                    className="glass-strong animate-fade-in-down"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: "240px",
                      borderRadius: "var(--radius-lg)",
                      padding: "8px",
                      zIndex: 50,
                      boxShadow: "var(--shadow-elevated)",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--border-subtle)",
                        marginBottom: "4px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        {user.name || "User"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          margin: "2px 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await authClient.signOut();
                        window.location.href = "/";
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "transparent",
                        color: "var(--accent-primary-bright)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background var(--transition-fast)",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--bg-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <LogOutIcon size={16} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/" className="btn-primary" style={{ fontSize: "0.813rem", padding: "8px 20px" }}>
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                padding: "8px",
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && user && (
        <div
          className="glass-strong animate-fade-in-down show-mobile-flex"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "4px",
            padding: "8px 24px 16px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.938rem",
                fontWeight: 500,
                background: isActive(link.href)
                  ? "var(--bg-elevated)"
                  : "transparent",
                color: isActive(link.href)
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile {
            display: flex !important;
          }
          .show-mobile-flex {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .show-mobile {
            display: none !important;
          }
          .show-mobile-flex {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}

/* ===== Inline SVG Icons ===== */
function FlameIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function UsersIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HeartIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ChevronDownIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogOutIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function MenuIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
