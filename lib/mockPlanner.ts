import { TimelineItem } from "../components/planner/PlanTimeline";

export interface GeneratedPlan {
  items: TimelineItem[];
  totalTasks: number;
  focusTime: string;
  breakTime: string;
  completionEstimate: string;
  productivityScore: number;
  heading: string;
}

const PLAN_TEMPLATES: GeneratedPlan[] = [
  {
    heading: "Your Optimized Day Plan",
    productivityScore: 87,
    focusTime: "6h 30m",
    breakTime: "1h 30m",
    completionEstimate: "10:00 PM",
    totalTasks: 7,
    items: [
      {
        id: "1", period: "Morning", time: "7:00 AM", activity: "Morning Routine & Exercise",
        duration: "45 min", icon: "🌅",
        color: "#F59E0B", textColor: "#92400E",
        aiNote: "Starting with movement primes your brain for deep work. Even 20 minutes of cardio elevates focus for hours.",
      },
      {
        id: "2", period: "Morning", time: "8:00 AM", activity: "Deep Work Block #1",
        duration: "90 min", icon: "🎯",
        color: "#4F46E5", textColor: "#3730A3",
        aiNote: "Your cognitive peak is usually 2–4 hours after waking. I've placed your hardest task here.",
      },
      {
        id: "3", period: "Afternoon", time: "12:30 PM", activity: "Lunch & Recovery Break",
        duration: "45 min", icon: "🥗",
        color: "#10B981", textColor: "#065F46",
        aiNote: "A real break — away from screens — improves afternoon performance significantly.",
      },
      {
        id: "4", period: "Afternoon", time: "2:00 PM", activity: "Deep Work Block #2",
        duration: "2h", icon: "💻",
        color: "#2563EB", textColor: "#1E40AF",
        aiNote: "Post-lunch focus dip usually ends around 2 PM. This is your second-best window.",
      },
      {
        id: "5", period: "Evening", time: "5:30 PM", activity: "Review & Planning",
        duration: "30 min", icon: "📋",
        color: "#6366F1", textColor: "#3730A3",
        aiNote: "End-of-day reviews reduce cognitive load tomorrow by up to 40%.",
      },
      {
        id: "6", period: "Evening", time: "7:00 PM", activity: "Personal Project / Learning",
        duration: "90 min", icon: "📚",
        color: "#8B5CF6", textColor: "#5B21B6",
        aiNote: "Evenings are ideal for creative or exploratory work — lower pressure, higher curiosity.",
      },
      {
        id: "7", period: "Night", time: "9:30 PM", activity: "Wind Down & Tomorrow Prep",
        duration: "30 min", icon: "🌙",
        color: "#0EA5E9", textColor: "#0369A1",
        aiNote: "A consistent wind-down signals your brain to consolidate today's learning during sleep.",
      },
    ],
  },
  {
    heading: "Interview Preparation Plan",
    productivityScore: 92,
    focusTime: "7h 00m",
    breakTime: "1h 15m",
    completionEstimate: "9:30 PM",
    totalTasks: 6,
    items: [
      {
        id: "1", period: "Morning", time: "8:00 AM", activity: "DSA Warm-Up",
        duration: "90 min", icon: "🧠",
        color: "#F59E0B", textColor: "#92400E",
        aiNote: "Solve 3–4 medium LeetCode problems. Focus on patterns: two pointers, sliding window, graphs.",
      },
      {
        id: "2", period: "Morning", time: "10:00 AM", activity: "System Design Review",
        duration: "90 min", icon: "🏗️",
        color: "#4F46E5", textColor: "#3730A3",
        aiNote: "Cover URL shortener, Twitter feed, and rate limiting. These come up in 70% of senior interviews.",
      },
      {
        id: "3", period: "Afternoon", time: "12:30 PM", activity: "Lunch & Mental Reset",
        duration: "45 min", icon: "🥗",
        color: "#10B981", textColor: "#065F46",
        aiNote: "Step outside for 15 minutes. Fresh air and daylight reset cortisol — crucial before afternoon prep.",
      },
      {
        id: "4", period: "Afternoon", time: "2:00 PM", activity: "Behavioral & STAR Stories",
        duration: "2h", icon: "🗣️",
        color: "#EF4444", textColor: "#991B1B",
        aiNote: "Prepare 5–7 STAR stories. Practice conflict resolution, leadership, and failure narratives.",
      },
      {
        id: "5", period: "Evening", time: "5:00 PM", activity: "Mock Interview Session",
        duration: "60 min", icon: "🎤",
        color: "#2563EB", textColor: "#1E40AF",
        aiNote: "Use Pramp or a peer. Real-time practice under pressure is irreplaceable at this stage.",
      },
      {
        id: "6", period: "Night", time: "8:30 PM", activity: "Light Review & Rest",
        duration: "30 min", icon: "🌙",
        color: "#6366F1", textColor: "#3730A3",
        aiNote: "Skim your notes — don't cram. Sleep is the #1 interview performance enhancer.",
      },
    ],
  },
  {
    heading: "Hackathon Sprint Plan",
    productivityScore: 95,
    focusTime: "10h 00m",
    breakTime: "2h 00m",
    completionEstimate: "11:00 PM",
    totalTasks: 8,
    items: [
      {
        id: "1", period: "Morning", time: "8:00 AM", activity: "Kickoff & Team Sync",
        duration: "30 min", icon: "⚡",
        color: "#F59E0B", textColor: "#92400E",
        aiNote: "Align on problem, tech stack, and who owns what. A shared Notion doc prevents duplicated work.",
      },
      {
        id: "2", period: "Morning", time: "8:30 AM", activity: "Architecture & Setup",
        duration: "90 min", icon: "🏗️",
        color: "#4F46E5", textColor: "#3730A3",
        aiNote: "Set up repo, CI, and base scaffold now — fighting tooling issues at 10 PM kills momentum.",
      },
      {
        id: "3", period: "Morning", time: "10:00 AM", activity: "Core Feature Build Sprint",
        duration: "2h", icon: "💻",
        color: "#10B981", textColor: "#065F46",
        aiNote: "Build the MVP core feature first. Ship something that works over something that's perfect.",
      },
      {
        id: "4", period: "Afternoon", time: "12:30 PM", activity: "Lunch Break (30 min max)",
        duration: "30 min", icon: "⏱️",
        color: "#6B7280", textColor: "#374151",
        aiNote: "Quick fuel — avoid heavy food. Cognitive dip hits harder when the deadline is real.",
      },
      {
        id: "5", period: "Afternoon", time: "1:00 PM", activity: "API Integration Sprint",
        duration: "2h 30m", icon: "🔌",
        color: "#2563EB", textColor: "#1E40AF",
        aiNote: "Wire up your backend and any third-party APIs. This is usually where scope creep happens — resist.",
      },
      {
        id: "6", period: "Evening", time: "4:00 PM", activity: "Frontend Polish & UX",
        duration: "2h", icon: "🎨",
        color: "#8B5CF6", textColor: "#5B21B6",
        aiNote: "Judges spend ~2 minutes on your demo. A clean UI tells a better story than hidden features.",
      },
      {
        id: "7", period: "Evening", time: "7:00 PM", activity: "Testing & Bug Fix",
        duration: "90 min", icon: "🧪",
        color: "#EF4444", textColor: "#991B1B",
        aiNote: "Kill the critical-path bugs. Edge cases can stay — your demo should work flawlessly.",
      },
      {
        id: "8", period: "Night", time: "9:00 PM", activity: "Pitch Deck & Demo Prep",
        duration: "2h", icon: "🎯",
        color: "#F59E0B", textColor: "#92400E",
        aiNote: "Problem → Solution → Demo → Impact → Ask. 5 slides max. Practice the live demo 3 times.",
      },
    ],
  },
  {
    heading: "Weekly Study Plan",
    productivityScore: 84,
    focusTime: "8h 00m",
    breakTime: "2h 00m",
    completionEstimate: "9:00 PM",
    totalTasks: 6,
    items: [
      {
        id: "1", period: "Morning", time: "7:30 AM", activity: "Active Recall Review",
        duration: "45 min", icon: "🔁",
        color: "#F59E0B", textColor: "#92400E",
        aiNote: "Review yesterday's material using flashcards or free recall — this beats re-reading by 2×.",
      },
      {
        id: "2", period: "Morning", time: "8:30 AM", activity: "New Concept Study",
        duration: "2h", icon: "📖",
        color: "#4F46E5", textColor: "#3730A3",
        aiNote: "Deep reading in the morning while working memory is fresh. Annotate — don't highlight passively.",
      },
      {
        id: "3", period: "Afternoon", time: "1:00 PM", activity: "Practice Problems",
        duration: "90 min", icon: "✏️",
        color: "#10B981", textColor: "#065F46",
        aiNote: "Application cements understanding. Struggle productively — consult notes only when truly stuck.",
      },
      {
        id: "4", period: "Afternoon", time: "3:00 PM", activity: "Weak Areas Drill",
        duration: "60 min", icon: "🎯",
        color: "#EF4444", textColor: "#991B1B",
        aiNote: "Deliberate practice on weak areas is 4× more effective than studying what you already know.",
      },
      {
        id: "5", period: "Evening", time: "5:30 PM", activity: "Group Study / Discussion",
        duration: "90 min", icon: "👥",
        color: "#2563EB", textColor: "#1E40AF",
        aiNote: "Teaching others exposes your own gaps. The Feynman technique in a group setting is unmatched.",
      },
      {
        id: "6", period: "Night", time: "8:30 PM", activity: "Spaced Repetition Session",
        duration: "30 min", icon: "🌙",
        color: "#6366F1", textColor: "#3730A3",
        aiNote: "Anki or Notion flashcards before sleep. Your brain consolidates spaced repetition during deep sleep.",
      },
    ],
  },
];

export function generatePlan(prompt: string): GeneratedPlan {
  const lower = prompt.toLowerCase();

  if (lower.includes("interview") || lower.includes("prep")) {
    return PLAN_TEMPLATES[1];
  }
  if (lower.includes("hackathon") || lower.includes("sprint")) {
    return PLAN_TEMPLATES[2];
  }
  if (lower.includes("study") || lower.includes("assignment") || lower.includes("exam") || lower.includes("dsa") || lower.includes("ml")) {
    return PLAN_TEMPLATES[3];
  }
  if (lower.includes("week")) {
    return { ...PLAN_TEMPLATES[0], heading: "Your Optimized Week Plan" };
  }

  // default: day plan
  return PLAN_TEMPLATES[0];
}
