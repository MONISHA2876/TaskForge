"use client";

import { motion, MotionConfig } from "motion/react";
import Sidebar from "@/components/layout/SideBar";
import UpcomingTasks from "@/components/tasks/UpcomingTasks";
import MissedTasks from "@/components/tasks/MissedTasks";
import { page } from "@/components/styles/styles";

export default function Tasks() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen bg-[#070d1e] text-white">
        {/* soft ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_85%_-10%,rgba(90,125,230,0.12),transparent_70%)]"
        />

        {/* Column 1 — fixed 300px sidebar (hamburger drawer below lg) */}
        <Sidebar />

        {/* Columns 2 + 3 — content, offset by the sidebar width on lg+ */}
        <main className="lg:pl-[300px]">
          <motion.div
            variants={page}
            initial="hidden"
            animate="show"
            className="mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-6 px-4 pt-20 pb-14 sm:px-8 md:grid-cols-2 lg:grid-cols-1 lg:px-10 lg:pt-10 xl:grid-cols-2"
          >
            <UpcomingTasks />
            <MissedTasks />
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
}