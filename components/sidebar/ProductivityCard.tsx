interface ProductivityCardProps {
  label: string;
  value: string | number;
  icon: string;
  accentColor: string;
  accentBg: string;
}

export function ProductivityCard({ label, value, icon, accentColor, accentBg }: ProductivityCardProps) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #E5E7EB",
      borderRadius: "14px", padding: "14px",
    }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "16px", marginBottom: "10px",
        background: accentBg, color: accentColor,
      }}>
        {icon}
      </div>
      <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "5px" }}>
        {label}
      </p>
      <p style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1, color: accentColor }}>
        {value}
      </p>
    </div>
  );
}
