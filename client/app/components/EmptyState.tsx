interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-dim)",
          fontSize: "28px",
        }}
      >
        {icon || "📭"}
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              maxWidth: "360px",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* CTA */}
      {action && (
        <button
          className="btn-primary"
          onClick={action.onClick}
          disabled={action.loading}
          style={{
            marginTop: "8px",
            opacity: action.loading ? 0.7 : 1,
            cursor: action.loading ? "not-allowed" : "pointer",
          }}
        >
          {action.loading ? (
            <span
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin-slow 0.6s linear infinite",
              }}
            />
          ) : null}
          {action.label}
        </button>
      )}
    </div>
  );
}
