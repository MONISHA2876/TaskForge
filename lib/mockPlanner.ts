import { TimelineDay } from "../components/planner/PlanTimeline";

export interface GeneratedPlan {
  days: TimelineDay[];
  totalTasks: number;
  focusTime: string;
  breakTime: string;
  completionEstimate: string;
  productivityScore: number;
  heading: string;
}
