"use client";

import React from "react";

interface DashboardLayoutProps {
  leftSidebar: React.ReactNode;
  main: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export function DashboardLayout({
  leftSidebar,
  main,
  rightSidebar,
}: DashboardLayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "350px 1fr 300px",
        gridTemplateRows: "1fr",
        height: "calc(100vh - 60px)", // full height minus navbar
        overflow: "hidden",
        backgroundColor: "#F7F6F3",
      }}
    >
      {/* Left Sidebar */}
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "28px 20px",
          borderRight: "1px solid #E5E7EB",
          backgroundColor: "#ffffff",
          overflowY: "auto",
          height: "100%",
        }}
      >
        {leftSidebar}
      </aside>

      {/* Main Content */}
      <main
        style={{
          overflowY: "auto",
          padding: "36px 40px",
          backgroundColor: "#F7F6F3",
          height: "100%",
        }}
      >
        {main}
      </main>

      {/* Right Sidebar */}
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "28px 20px",
          borderLeft: "1px solid #E5E7EB",
          backgroundColor: "#ffffff",
          overflowY: "auto",
          height: "100%",
        }}
      >
        {rightSidebar}
      </aside>
    </div>
  );
}
