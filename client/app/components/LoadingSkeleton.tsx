export function VideoCardSkeleton() {
  return (
    <div className="card-flat" style={{ overflow: "hidden" }}>

      <div
        className="skeleton"
        style={{
          width: "100%",
          paddingTop: "56.25%",
          borderRadius: 0,
        }}
      />

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton" style={{ height: "14px", width: "90%", borderRadius: "6px" }} />
        <div className="skeleton" style={{ height: "14px", width: "60%", borderRadius: "6px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <div className="skeleton" style={{ height: "12px", width: "40%", borderRadius: "6px" }} />
          <div className="skeleton" style={{ height: "12px", width: "20%", borderRadius: "6px" }} />
        </div>
      </div>
    </div>
  );
}

export function SubscriptionCardSkeleton() {
  return (
    <div
      className="card-flat"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "20px 16px",
        width: "180px",
        minWidth: "180px",
      }}
    >
      <div className="skeleton" style={{ width: "64px", height: "64px", borderRadius: "50%" }} />
      <div className="skeleton" style={{ height: "12px", width: "80%", borderRadius: "6px" }} />
      <div className="skeleton" style={{ height: "10px", width: "60%", borderRadius: "6px" }} />
    </div>
  );
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SubscriptionScrollSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="scroll-container">
      {Array.from({ length: count }).map((_, i) => (
        <SubscriptionCardSkeleton key={i} />
      ))}
    </div>
  );
}
