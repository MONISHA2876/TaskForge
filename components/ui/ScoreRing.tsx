import { getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 48 }: ScoreRingProps) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = getScoreColor(score);

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label={`Score: ${score}`}>
      {/* Track */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#E8E6E1"
        strokeWidth="4"
      />
      {/* Progress */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      {/* Label */}
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={color}
        fontFamily="Inter, sans-serif"
      >
        {score}
      </text>
    </svg>
  );
}
