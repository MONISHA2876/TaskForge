"use client";

import { Navbar } from "@/components/layout/Navbar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Left sidebar sections
import { UpcomingTasks } from "@/components/tasks/UpcomingTasks";
import { MissedTasks } from "@/components/tasks/MissedTasks";
import { ProductivitySummary } from "@/components/sidebar/ProductivitySummary";

// Main content
import { PageGreeting } from "@/components/dashboard/PageGreeting";
import { ActivePlans } from "@/components/plans/ActivePlans";

// Right sidebar sections
import { PlannerCTA } from "@/components/sidebar/PlannerCTA";
import { RecentActivity } from "@/components/sidebar/RecentActivity";
import { AIInsights } from "@/components/sidebar/AIInsights";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <DashboardLayout
        leftSidebar={
          <>
            <UpcomingTasks />
            <MissedTasks />
            <ProductivitySummary />
          </>
        }
        main={
          <>
            <PageGreeting />
            <ActivePlans />
          </>
        }
        rightSidebar={
          <>
            <PlannerCTA />
            <RecentActivity />
            <AIInsights />
          </>
        }
      />
    </div>
  );
}
