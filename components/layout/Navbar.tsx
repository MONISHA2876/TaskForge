"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Bell, Settings } from "lucide-react";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_2px_8px_rgba(79,70,229,0.3)]">
        <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] fill-white">
          <path d="M10 2L13 8H18L14 12L16 18L10 14L4 18L6 12L2 8H7L10 2Z" />
        </svg>
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-bold text-gray-900 tracking-[-0.3px]">
          TaskForge
        </div>
        <div className="text-[10px] text-gray-400 font-medium tracking-[0.3px] uppercase mt-px">
          AI Productivity
        </div>
      </div>
    </div>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "AI Planner", href: "/planner" },
];

function NavItem({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 ${
        isActive
          ? "text-indigo-600"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute bottom-[-1px] left-3.5 right-3.5 h-[2px] bg-indigo-600 rounded-t-[2px]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

// ─── Icon Button ──────────────────────────────────────────────────────────────

function IconButton({
  children,
  label,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  badge?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      className="relative w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
    >
      {children}
      {badge && (
        <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
      )}
    </motion.button>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[12px] font-bold text-white cursor-pointer border-2 border-white shadow-[0_0_0_1.5px_#4F46E5]"
      aria-label="User profile"
    >
      AJ
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-[60px] px-6 flex items-center gap-4 bg-white border-b border-gray-200">
      <Logo />

      <nav className="flex items-center gap-1 flex-1 justify-center">
        {NAV_LINKS.map((link) => (
          <NavItem key={link.href} {...link} />
        ))}
      </nav>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <IconButton label="Search">
          <Search size={15} />
        </IconButton>
        <IconButton label="Notifications" badge>
          <Bell size={15} />
        </IconButton>
        <UserAvatar />
        <IconButton label="Settings">
          <Settings size={15} />
        </IconButton>
      </div>
    </header>
  );
}
