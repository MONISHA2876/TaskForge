import { type Variants } from "motion/react";


/** Page-level container: staggers each top-level block */
const page: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Fade + rise for each block */
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/** Staggered list rows inside a block (custom = row index) */
const row: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/** Chart bars grow up from the baseline (custom = bar index) */
const bar: Variants = {
  hidden: { scaleY: 0 },
  show: (i: number) => ({
    scaleY: 1,
    transition: { delay: 0.4 + i * 0.07, duration: 0.7, ease: "easeOut" },
  }),
};

/** Progress bar fill */
const fill: Variants = {
  hidden: { width: "0%" },
  show: {
    width: `100%`,
    transition: { delay: 0.6, duration: 1.1, ease: "easeOut" },
  },
};

const card =
  "rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0e1832]/80 to-[#0a1228]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b77a]";
const linkGold =
  "inline-flex items-center gap-1.5 text-[12px] font-medium text-[#ecd5a5] transition-colors hover:text-white " +
  focusRing;

export {page, rise, row, bar, fill, card, focusRing, linkGold}