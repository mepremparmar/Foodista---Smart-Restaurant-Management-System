import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useApp } from "@/lib/store";

export function CursorBeam() {
  const { theme } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth trailing spring settings
  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {/* Outer soft light beam */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full pointer-events-none select-none blur-md"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(216, 110, 50, 0.25) 0%, rgba(216, 110, 50, 0.08) 45%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(251, 191, 36, 0.06) 45%, rgba(0,0,0,0) 70%)",
          mixBlendMode: theme === "dark" ? "screen" : "normal",
        }}
      />
    </motion.div>
  );
}
