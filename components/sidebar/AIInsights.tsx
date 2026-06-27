import { AI_INSIGHTS } from "@/lib/placeholder-data";

export function AIInsights() {
  return (
    <div>
      <div style={{ marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase" }}>
          AI Insights
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {AI_INSIGHTS.map((insight) => (
          <div key={insight.id} style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
            padding: "14px", background: "#ffffff",
            border: "1px solid #E5E7EB", borderRadius: "14px",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "#EEF2FF", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "17px", flexShrink: 0,
            }}>
              {insight.icon}
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.55, paddingTop: "2px" }}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
