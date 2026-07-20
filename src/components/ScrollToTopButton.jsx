"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible,  setVisible]  = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY    = window.scrollY;
      const docH       = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docH > 0 ? (scrollY / docH) * 100 : 0;
      setVisible(scrollY > 400);
      setProgress(Math.min(100, pct));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // SVG circle params
  const radius      = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset  = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-secondary-800 shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-glow-blue group ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-secondary-100 dark:text-secondary-700"
        />
        {/* Progress */}
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-100"
        />
      </svg>

      {/* Arrow */}
      <ArrowUp
        size={18}
        className="relative z-10 text-primary-600 dark:text-primary-400 group-hover:-translate-y-0.5 transition-transform duration-150"
      />
    </button>
  );
}