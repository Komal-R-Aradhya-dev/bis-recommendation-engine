import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { fadeUp } from "@/lib/motion";
import { useSceneMode } from "@/lib/useSceneMode";

interface AuthLayoutProps {
  kicker: string;
  title: string;
  children: ReactNode;
}

export default function AuthLayout({
  kicker,
  title,
  children,
}: AuthLayoutProps) {
  useSceneMode("auth");
  const reduced = useReducedMotion();

  return (
    <div className="relative z-10 min-h-screen overflow-x-hidden">
      <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-8">
        <ThemeToggle compact />
      </div>
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp(reduced)}
          className="relative flex flex-col justify-between px-5 py-10 sm:px-10 lg:px-16 lg:py-16"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <p className="font-deva absolute -left-4 top-24 text-[7.5rem] leading-none text-bis-ink opacity-[0.06] sm:text-[9rem]">
              मानक
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4 pr-14">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bis-surface">
                <img
                  src="/bis-logo.png"
                  alt="Bureau of Indian Standards"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-bis-ink">
                  BUREAU OF INDIAN STANDARDS
                </p>
                <p className="mt-1 font-deva text-sm text-bis-muted">
                  भारतीय मानक ब्यूरो
                </p>
              </div>
            </div>

            <p className="bis-kicker mt-16">{kicker}</p>
            <h1 className="bis-display mt-4 max-w-xl text-4xl sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-bis-muted sm:text-base">
              An Indian Standards intelligence platform for procurement —
              precise, restrained, and built for the work of government.
            </p>
          </div>

          <p className="relative mt-12 font-mono text-[11px] tracking-[0.12em] text-bis-muted uppercase">
            Government of India · Standards Build a Safer, Stronger India
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp(reduced)}
          className="flex items-center px-5 pb-12 sm:px-10 lg:px-12 lg:py-16"
        >
          <div className="bis-surface w-full max-w-md rounded-[18px] p-6 sm:p-9">
            {children}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
