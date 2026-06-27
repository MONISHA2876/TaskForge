"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  size?: "sm" | "md";
}

export function TaskCheckbox({
  checked,
  onChange,
  size = "sm",
}: TaskCheckboxProps) {
  const dim = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      whileTap={{ scale: 0.88 }}
      aria-checked={checked}
      role="checkbox"
      aria-label="Toggle task completion"
      className={`
        ${dim} flex-shrink-0 rounded-[4px] border-[1.5px] flex items-center justify-center
        transition-colors duration-150 cursor-pointer focus:outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
        ${checked
          ? "bg-indigo-600 border-indigo-600"
          : "bg-white border-gray-300 hover:border-gray-400"
        }
      `}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            viewBox="0 0 12 12"
            className="w-[9px] h-[9px]"
          >
            <polyline
              points="2,6 5,9 10,3"
              stroke="white"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
