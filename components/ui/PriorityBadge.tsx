import type { Priority } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
}

const styles: Record<Priority, { bg: string; color: string }> = {
  High:   { bg: "#FEF2F2", color: "#B91C1C" },
  Medium: { bg: "#FFFBEB", color: "#92400E" },
  Low:    { bg: "#ECFDF5", color: "#065F46" },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const s = styles[priority];
  return (
    <span style={{
      fontSize: "10px", fontWeight: 700, padding: "2px 8px",
      borderRadius: "99px", letterSpacing: "0.2px",
      background: s.bg, color: s.color,
    }}>
      {priority}
    </span>
  );
}
