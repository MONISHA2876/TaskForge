interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase" }}>
        {title}
      </span>
      {action}
    </div>
  );
}
