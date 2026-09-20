import type { Transition, Variants } from "framer-motion";

export const easeOutExpo: Transition["ease"] = [0.22, 1, 0.36, 1];

export const fadeUp = (reduced: boolean | null): Variants => ({
  hidden: {
    opacity: 0,
    y: reduced ? 0 : 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0.01 : 0.55,
      ease: easeOutExpo,
    },
  },
});

export const fadeIn = (reduced: boolean | null): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: reduced ? 0.01 : 0.45,
      ease: easeOutExpo,
    },
  },
});

export const stagger = (reduced: boolean | null): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : 0.055,
      delayChildren: reduced ? 0 : 0.06,
    },
  },
});
