interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.375rem",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {title}
          {/* Gradient accent line */}
          <span
            style={{
              display: "inline-block",
              width: "24px",
              height: "3px",
              borderRadius: "2px",
              background:
                "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
            }}
          />
        </h2>
        {subtitle && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
